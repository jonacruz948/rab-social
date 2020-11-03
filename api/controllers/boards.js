const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const shortid = require("shortid");
const _ = require("lodash/array");

var db = require("../database/connection");
var Board = require("../models/boards");
const Bookmark = require("../models/bookmarks");
const Cards = require("../models/cards");
const Profile = require("../models/profile");
const { shortenURL } = require("../utils/core");
var express_helper = require("../helpers/express");

const {
  AWS: { accessKeyId, secretAccessKey, region, bucket },
} = require("../config");

const s3bucket = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

var private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

var handler = {
  getBoard: function (req, res) {
    const boardID = req.params.id;

    private._wrapCon(res, () => {
      Board.findOne({ _id: boardID }, async function (err, board) {
        if (err) express_helper.handle_error(err, res);
        if (board) {
          const { cards, userID } = board;
          const cardIDs = [...cards.media, ...cards.action];

          Promise.all(
            cardIDs.map(async (cardID) => {
              try {
                const card = await Cards.getCardByID(cardID);
                const bookmark = await Bookmark.findOne(
                  { cardID },
                  "slug"
                ).exec();
                return bookmark ? { ...card, slug: bookmark.slug } : null;
              } catch (e) {
                return;
              }
            })
          ).then(async (cardData) => {
            const profile = await Profile.findOne({ userID }).exec();
            res.status(200).send({
              result: 0,
              cards: cardData.filter((el) => el),
              board,
              avatar: profile.avatar,
              boardOwner: profile.fullName,
            });
          });
        } else {
          res.status(200).send({
            result: 1,
            message: "Board doesn't exist",
          });
        }
      });
    });
  },

  getBookmarkBoards: function (req, res) {
    const { id: userID } = req.params;

    private._wrapCon(res, async () => {
      try {
        const bkBoardsByUser = await Profile.findOne(
          { userID },
          "bookmarkedboards"
        ).exec();

        if (bkBoardsByUser) {
          if (bkBoardsByUser.bookmarkedboards.length > 0) {
            const { bookmarkedboards } = bkBoardsByUser;
            Promise.all(
              bookmarkedboards.map(async (boardID) => {
                console.log("boardID ===> ", boardID);
                if (mongoose.Types.ObjectId.isValid(boardID)) {
                  const {
                    name,
                    coverimage,
                    userID,
                    cards,
                  } = await Board.findById(
                    boardID,
                    "name coverimage userID cards"
                  )
                    .limit(2)
                    .exec();
                  const { avatar, fullName } = await Profile.findOne(
                    { userID },
                    "avatar fullName"
                  );
                  return {
                    name,
                    coverimage,
                    avatar,
                    fullName,
                    boardID,
                    cards,
                  };
                }
              })
            ).then((boards) => {
              let cardIDs = [];
              if (boards.length > 0) {
                boards
                  .map((item) => [...item.cards.media, ...item.cards.action])
                  .forEach((el) => cardIDs.push(...el));
                cardIDs = [...new Set(cardIDs)];
                Promise.all(
                  cardIDs.map(async (cardID) => {
                    const cardFromContentful = await Cards.getCardByID(cardID);
                    const { id } = cardFromContentful;

                    const bookmark = await Bookmark.findOne(
                      {
                        cardID: id,
                      },
                      "slug"
                    ).exec();

                    return bookmark
                      ? { ...cardFromContentful, slug: bookmark.slug }
                      : { ...cardFromContentful };
                  })
                ).then((cardData) => {
                  res.status(200).send({ result: 0, boards, cardData });
                });
              } else {
                res.status(200).send({ result: 0, boards });
              }
            });
          } else {
            res.status(200).send({ result: 0, boards: null });
          }
        }
      } catch (e) {
        if (e) express_helper.handle_error(e, res);
      }
    });
  },

  getBoardsByUser: (req, res) => {
    const { userID } = req.query;

    private._wrapCon(res, () => {
      Board.find({ userID }, (err, boards) => {
        if (err) express_helper(err, res);
        res.send(boards);
      });
    });
  },

  getBoards: function (req, res) {
    private._wrapCon(res, () => {
      Board.find({}, function (err, boards) {
        if (err) express_helper.handle_error(err, res);
        res.send(boards);
      });
    });
  },

  createBoard: function (req, res) {
    const file = req.file;
    const { userID, name, bio, tags, media, action } = req.body;

    private._wrapCon(req, async () => {
      const { createdboards, bookmarkedcards } = await Profile.findOne({
        userID,
      }).exec();

      const bookmarkedCardIDs = bookmarkedcards.map(
        (bkCards) => bkCards.cardID
      );

      // remove the duplicated CardIDs user already bookmarked from profile.bookmarkedcards
      const removedDupMediaCards = media
        ? media
            .split(",")
            .filter((cardItem) => !bookmarkedCardIDs.includes(cardItem))
        : [];
      const removedDupActionCards = action
        ? action
            .split(",")
            .filter((cardItem) => !bookmarkedCardIDs.includes(cardItem))
        : [];
      const slug = `${name
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s/g, "-")}-${shortid.generate()}`;

      let board = {
        userID,
        name,
        bio,
        tags: tags ? tags.split(",") : [],
        slug,
        cards: {
          media: removedDupMediaCards,
          action: removedDupActionCards,
        },
      };

      if (file) {
        const params = {
          Bucket: `${bucket}/border-cover-images`,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        s3bucket.upload(params, async (err, data) => {
          if (err) {
            res.status(500).json({ error: true, message: err });
          } else {
            const { Location } = data;
            board = { ...board, coverimage: Location };
          }
        });
      }

      Board.create(board, async (err, nBoard) => {
        if (err) express_helper.handle_error(err, res);
        const { _id: boardID } = nBoard;

        //media and action cards to save on Profile.bookmarkedcards
        const mediaToSave = removedDupMediaCards.map((item) => ({
          cardID: item,
          boardID,
        }));

        const actionToSave = removedDupActionCards.map((item) => ({
          cardID: item,
          boardID,
        }));

        let profile;
        try {
          profile = await Profile.updateOne(
            { userID },
            {
              $set: {
                createdboards: [...createdboards, boardID],
                bookmarkedcards: [
                  ...bookmarkedcards,
                  ...mediaToSave,
                  ...actionToSave,
                ],
              },
            },
            { new: true }
          );
        } catch (e) {
          console.log(e);
        }

        Promise.all(
          [...removedDupMediaCards, ...removedDupActionCards].map(
            async (cardID) => {
              const cardBookmark = await Bookmark.findOne({
                cardID,
              }).exec();

              if (cardBookmark) {
                await Bookmark.updateOne(
                  { cardID },
                  {
                    $set: {
                      bookmark: cardBookmark.bookmark + 1,
                      bkUsers: [...cardBookmark.bkUsers, userID],
                    },
                  },
                  { new: true }
                );
                return {
                  bookmarkCount: cardBookmark.bookmark + 1,
                  bookmarkUsers: [...cardBookmark.bkUsers, userID],
                };
              } else {
                await Bookmark.create({
                  cardID,
                  bookmark: 1,
                  bkUsers: [userID],
                });
                return { bookmarkCount: 1, bookmarkUsers: [userID] };
              }
            }
          )
        ).then((bookmark) => {
          res.status(200).send({
            result: 0,
            profile,
            board: nBoard,
            bookmark,
          });
        });
      });
    });
  },

  addCardToBoard: function (req, res) {
    //get boardID from req.params.id
    const { boardID, cardID, cardType } = req.body;

    Cards.byId(cardID, (err, card) => {
      if (!err) {
        private._wrapCon(res, () => {
          Board.findOne({ _id: boardID }, function (err, board) {
            if (err) express_helper.handle_error(err, res);

            const exist = [
              ...board.cards.media,
              ...board.cards.action,
            ].findIndex((item) => item === cardID);
            if (exist !== -1) {
              res
                .status(403)
                .json({ result: 1, message: "Can't add same cards" });
            } else {
              let nCard = [];
              if (cardType === "media")
                nCard = {
                  media: [...board.cards.media, { cardID }],
                  action: [...board.cards.action],
                };
              if (cardType === "action")
                nCard = {
                  action: [...board.cards.action, { cardID }],
                  media: [...board.cards.media],
                };

              Board.update(
                { _id: boardID },
                {
                  cards: nCard,
                },
                (err, result) => {
                  if (err) express_helper.handle_error(err, res);
                  res
                    .status(200)
                    .send({ result: 0, message: "Card Added To Board" });
                }
              );
            }
          });
        });
      }
    });
  },

  getRecommendations: (req, res) => {
    const { hashTags } = req.query; //get the hashtags for the future work

    const tags = hashTags.split(",");
    Promise.all(
      tags.map(async (tag) => {
        return await Cards.searchByWords(tag, (card) => card);
      })
    ).then((cardData) => {
      let tmpCard = [];
      cardData.forEach((el) => {
        tmpCard = [...tmpCard, ...el];
      });
      tmpCard = _.uniqBy(tmpCard, "id");
      res.status(200).send(tmpCard);
    });
  },

  boardCoverImageUpload: (req, res) => {
    const file = req.file;
    const { boardID } = req.body;

    const params = {
      Bucket: `${bucket}/border-cover-images`,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3bucket.upload(params, async (err, data) => {
      if (err) {
        res.status(500).json({ error: true, message: err });
      } else {
        const { Location } = data;
        private._wrapCon(res, () => {
          Board.updateOne(
            { _id: boardID },
            { coverimage: Location },
            (err, nBoard) => {
              if (err) express_helper.handle_error(err, res);
              res.status(200).send({ result: 0, image: Location });
            }
          );
        });
      }
    });
  },

  updateBoard: function (req, res) {
    let { boardID, name, bio, tags } = req.body;
    private._wrapCon(res, () => {
      Board.updateOne(
        { _id: boardID },
        { name, bio, tags },
        (error, uBoard) => {
          if (error) express_helper.handle_error(err, res);
          res.status(200).send(uBoard);
          // if (uBoard.nModified === 1) res.status(200).send(uBoard);
          // else res.status(403).send(uBoard);
        }
      );
    });
  },

  deleteCardsFromBoard: (req, res) => {
    const boardID = req.params.id;
    const { cards: cardsToDelete, userID } = req.body;

    private._wrapCon(res, async () => {
      const board = await Board.findById(boardID).exec();
      const {
        cards: { media, action },
      } = board;

      const profile = await Profile.findOne({ userID }).exec();
      const { bookmarkedcards } = profile;
      let uBookmarkedCards = bookmarkedcards;
      let uMedia = media;
      let uAction = action;

      Promise.all(
        cardsToDelete.map(async (el) => {
          uBookmarkedCards.splice(
            uBookmarkedCards.findIndex(
              (element) => element.cardID === el.cardID
            ),
            1
          );

          if (el.cardType === "media") {
            uMedia.splice(
              uMedia.findIndex((item) => item === el.cardID),
              1
            );
          } else {
            uAction.splice(
              uAction.findIndex((item) => item === el.cardID),
              1
            );
          }

          const cardBookmark = await Bookmark.findOne({
            cardID: el.cardID,
          }).exec();
          if (cardBookmark) {
            const { bookmark: bookmarkCount, bkUsers } = cardBookmark;
            let nBkUsers = bkUsers;
            console.log(nBkUsers, userID);
            if (nBkUsers.includes(userID)) {
              nBkUsers.splice(
                nBkUsers.findIndex((item) => item === userID),
                1
              );

              Bookmark.updateOne(
                { cardID: el.cardID },
                { $set: { bookmark: bookmarkCount - 1, bkUsers: nBkUsers } },
                (err, bookmark) => {
                  if (err) express_helper.handle_error(err, res);
                }
              );
            }
          }
        })
      ).then(async (result) => {
        await Board.updateOne(
          { _id: boardID },
          { cards: { media: uMedia, action: uAction } }
        );

        await Profile.updateOne(
          { userID },
          { bookmarkedcards: uBookmarkedCards }
        );
        res.status(200).send({ result: 0 });
      });
    });
  },

  deleteBoard: function (req, res) {
    const { boardID, userID } = req.body;
    private._wrapCon(res, async () => {
      const profile = await Profile.findOne({ userID }).exec();
      if (profile) {
        const { createdboards, bookmarkedcards } = profile;
        let uCreatedBoards = createdboards;

        const cardsToRemoveUserIDs = bookmarkedcards.filter(
          (el) => el.boardID === boardID
        );

        Promise.all(
          cardsToRemoveUserIDs.map(async (cardInfo) => {
            const { cardID } = cardInfo;
            const card = await Bookmark.findOne(
              { cardID },
              "bkUsers bookmark"
            ).exec();

            if (card) {
              const { bkUsers } = card;
              const uBkUsers = bkUsers.filter(
                (bkUserID) => bkUserID !== userID
              );

              try {
                const uBookmark = await Bookmark.updateOne(
                  { cardID },
                  { bkUsers: uBkUsers },
                  { new: true }
                ).exec();

                return uBookmark;
              } catch (e) {
                console.log(e);
                res.status(500).send(e);
              }
            } else {
              return {};
            }
          })
        ).then(async (updates) => {
          const uBookmarkedCards = bookmarkedcards.filter(
            (el) => el.boardID !== boardID
          );

          uCreatedBoards.splice(
            createdboards.findIndex((el) => el === boardID),
            1
          );

          await Profile.updateOne(
            { userID },
            { createdboards: uCreatedBoards, bookmarkedcards: uBookmarkedCards }
          );
          await Board.findByIdAndDelete(boardID).exec();
          res.status(200).send({ message: "Delete Success" });
        });
      }
    });
  },

  bookmarkBoard: (req, res) => {
    const { userID, boardID, creatorID } = req.body;

    private._wrapCon(res, async () => {
      const profile = await Profile.findOne({ userID }).exec();
      const board = await Board.findById(boardID).exec();
      const creatorProfile = await Profile.findOne({
        userID: creatorID,
      }).exec();

      if (creatorProfile)
        await Profile.updateOne(
          { userID: creatorID },
          {
            $set: {
              shares: [...creatorProfile.shares, { boardID }],
            },
          }
        );

      if (profile)
        await Profile.updateOne(
          { userID },
          {
            $set: {
              bookmarkedboards: [
                ...new Set([...profile.bookmarkedboards, boardID]),
              ],
              bkBoardsTimestamp: [...profile.bkBoardsTimestamp, { boardID }],
            },
          }
        );

      if (board)
        await Board.updateOne(
          { _id: boardID },
          { $set: { bookmark: [...new Set([...board.bookmark, userID])] } }
        );

      res.status(200).send({ result: 0 });
    });
  },

  removeBookmark: (req, res) => {
    const { userID, boardID, creatorID } = req.body;

    private._wrapCon(res, async () => {
      const profile = await Profile.findOne({ userID }).exec();
      const board = await Board.findById(boardID).exec();
      const creatorProfile = await Profile.findOne({
        userID: creatorID,
      }).exec();

      let boardBookmark = board.bookmark;
      let profileBookmark = profile.bookmarkedboards;
      let bkBoardsTimestamp = profile.bkBoardsTimestamp;
      let creatorShares = creatorProfile.shares;

      boardBookmark.splice(
        boardBookmark.findIndex((item) => item === userID),
        1
      );

      bkBoardsTimestamp.splice(
        bkBoardsTimestamp.findIndex((el) => el.boardID === boardID),
        1
      );
      profileBookmark.splice(
        profileBookmark.findIndex((item) => item === boardID),
        1
      );

      creatorShares.splice(
        creatorShares.findIndex((el) => el.boardID === boardID),
        1
      );

      await Profile.updateOne(
        { userID },
        { $set: { bookmarkedboards: profileBookmark, bkBoardsTimestamp } }
      );
      await Profile.updateOne(
        { userID: creatorID },
        { $set: { shares: creatorShares } }
      );
      await Board.updateOne(
        { _id: boardID },
        { $set: { bookmark: boardBookmark } }
      );

      res.status(200).send({ result: 0 });
    });
  },

  findMoreIdeaCards: (req, res) => {
    const { boardID } = req.params;
    private._wrapCon(res, async () => {
      const board = await Board.findById(boardID, "tags cards").exec();
      const { tags, cards } = board;
      const cardIDs = [...cards.media, ...cards.action];
      //default tag -> climate
      const cardByBoardTags = await Cards.byTag(
        [...tags, "climate"].join(","),
        (el) => el
      );

      const filteredCards = cardByBoardTags.filter(
        (el) => !cardIDs.includes(el.id)
      );

      Promise.all(
        filteredCards.map(async (fCard) => {
          const { id } = fCard;
          const bookmark = await Bookmark.findOne(
            { cardID: id },
            "slug"
          ).exec();

          return bookmark ? { ...fCard, slug: bookmark.slug } : fCard;
        })
      ).then((completed) => {
        res.status(200).send(completed);
      });
    });
  },

  getShortenURL: async (req, res) => {
    const { url } = req.query;
    const { link: bitlyUrl } = await shortenURL(url);
    res.status(200).send({ result: 0, link: bitlyUrl });
  },

  shareBoardCount: (req, res) => {
    const { boardID } = req.params;
    private._wrapCon(res, async () => {
      const board = await Board.findById(boardID).exec();
      const { downloads } = board;
      const uBoard = await Board.findByIdAndUpdate(
        boardID,
        {
          $set: { downloads: downloads + 1 },
        },
        { new: true }
      ).exec();

      res.status(200).send(uBoard);
    });
  },
};

module.exports = handler;
