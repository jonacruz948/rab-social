const AWS = require("aws-sdk");
const _ = require("lodash/lang");

const cards = require("../models/cards");
const Comments = require("../models/comments");
const FinishedCards = require("../models/finishedCards");
const Bookmarks = require("../models/bookmarks");
const Profile = require("../models/profile");
const Board = require("../models/boards");

var db = require("../database/connection");
var express_helper = require("../helpers/express");
const Core = require("../utils/core");
const {
  AWS: { accessKeyId, secretAccessKey, region },
} = require("../config");

const { ACTION_KEYWORDS, BADGES } = require("../schemas/keywords");

AWS.config.update({
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

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

module.exports = {
  getAll: function (req, res) {
    cards.all((cards) => {
      res.send(cards);
    });
  },
  getAllBookmark: function (req, res) {
    private._wrapCon(res, async () => {
      const bookmarks = await Bookmarks.find({}).exec();
      res.status(200).send(bookmarks);
    });
  },
  getAllContentCard: function (req, res) {
    cards.allContentCards((cards) => res.status(200).send(cards));
  },
  getNewsCard: function (req, res) {
    cards.byType("news", (error, specialCards) => {
      res.send(specialCards);
    });
  },
  getOne: function (req, res) {
    const slug = req.params.id; //removed slug from pass parameters: (req, res, slug)

    function getBadgeURLFromActionKeyword(keyword) {
      if (BADGES[keyword]) return BADGES[keyword];
      return BADGES["default"];
    }

    private._wrapCon(res, async () => {
      const bookmark = await Bookmarks.findOne({ slug }).exec();

      if (!bookmark) {
        res.status(200).send({ message: "something went wrong!" });
      } else {
        const { cardID } = bookmark;
        cards.byId(cardID, (err, card) => {
          if (err) {
            res.status(404).send(err);
          }

          if (card.type !== "media") {
            const { causes } = card;
            let actionKeyword = "energy"; // socialjustice: default badge
            causes.forEach((el) => {
              const cause = "#" + el.replace(/\s+/g, "").toLowerCase();
              const tmpKeyword = Object.keys(ACTION_KEYWORDS).find((keyword) =>
                ACTION_KEYWORDS[keyword].includes(cause)
              );
              if (tmpKeyword) actionKeyword = tmpKeyword;
            });

            const badge = getBadgeURLFromActionKeyword(actionKeyword);
            res.status(200).send({
              card: { ...card, badge: { ...badge, actionKeyword } },
              bookmark,
            });
          } else {
            const { raActions } = card;
            Promise.all(
              raActions.map(async (raAction) => {
                const { raActionId } = raAction;
                const raBookmark = await Bookmarks.findOne({
                  cardID: raActionId,
                }).exec();

                return raBookmark
                  ? { ...raAction, raSlug: raBookmark.slug }
                  : raAction;
              })
            ).then((raActionData) => {
              res
                .status(200)
                .send({ card: { ...card, raActions: raActionData }, bookmark });
            });
          }
        });
      }
    });
  },

  bookmarkCardToBoard: (req, res) => {
    const { cards, boardID, userID } = req.body;
    private._wrapCon(res, async () => {
      /// Save cards to board
      const { cards: uCards } = await Board.findById(boardID, "cards").exec();
      let cardsForUpdate = {
        action: [...cards.action, ...uCards.action],
        media: [...cards.media, ...uCards.media],
      };

      const uBoard = await Board.updateOne(
        { _id: boardID },
        { $set: { cards: cardsForUpdate } }
      );

      /// Save cards to profile
      const mediaToSave = cards.media.map((item) => ({
        cardID: item,
        boardID,
      }));

      const actionToSave = cards.action.map((item) => ({
        cardID: item,
        boardID,
      }));

      const profile = await Profile.findOne({ userID }).exec();
      const uProfile = await Profile.updateOne(
        { userID },
        {
          bookmarkedcards: [
            ...profile.bookmarkedcards,
            ...mediaToSave,
            ...actionToSave,
          ],
        },
        { new: true }
      );

      Promise.all(
        [...cards.media, ...cards.action].map(async (cardID) => {
          const cardBookmark = await Bookmarks.findOne({ cardID }).exec();

          if (cardBookmark && !cardBookmark.bkUsers.includes(userID)) {
            await Bookmarks.updateOne(
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
            await Bookmarks.create({ cardID, bookmark: 1, bkUsers: [userID] });
            return { bookmarkCount: 1, bookmarkUsers: [userID] };
          }
        })
      ).then((bookmark) => {
        res.status(200).send({
          result: 0,
          propfile: uProfile._doc,
          board: uBoard,
          bookmark,
        });
      });
    });
  },

  removeBookmark: (req, res) => {
    const { cardID, userID, cardType } = req.body;

    private._wrapCon(res, async () => {
      const profile = await Profile.findOne({ userID }).exec();
      let uBookmarkedCards = profile.bookmarkedcards;

      let updatedProfileBookmarkedCards = uBookmarkedCards;

      const indexToGetBoardID = updatedProfileBookmarkedCards.findIndex(
        (item) => item.cardID === cardID
      );

      let uCards = [];
      if (indexToGetBoardID !== -1) {
        const { boardID } = updatedProfileBookmarkedCards[indexToGetBoardID];
        const { cards } = await Board.findById(boardID, "cards").exec();

        if (cardType === "media") {
          let uMedia = cards.media;
          uMedia.splice(
            uMedia.findIndex((item) => item === cardID),
            1
          );
          uCards = { action: cards.action, media: uMedia };
        } else {
          let uAction = cards.action;
          uAction.splice(
            uAction.findIndex((item) => item === cardID),
            1
          );
          uCards = { media: cards.media, action: uAction };
        }

        await Board.findByIdAndUpdate(boardID, { cards: uCards }).exec();

        updatedProfileBookmarkedCards.splice(indexToGetBoardID, 1);

        await Profile.updateOne(
          { userID },
          { bookmarkedcards: updatedProfileBookmarkedCards }
        );

        const cardBookmark = await Bookmarks.findOne({ cardID }).exec();
        if (cardBookmark) {
          const { bookmark: bookmarkCount, bkUsers } = cardBookmark;
          let nBkUsers = bkUsers;
          nBkUsers.splice(
            nBkUsers.findIndex((item) => item === userID),
            1
          );

          Bookmarks.updateOne(
            { cardID },
            { $set: { bookmark: bookmarkCount - 1, bkUsers: nBkUsers } },
            (err, bookmark) => {
              res.status(200).send({ result: 0, bookmark: bookmarkCount - 1 });
            }
          );
        }
      } else {
        res.status(200).send({
          result: 1,
          message: "Can't find the card",
        });
      }
    });
  },

  homeCarousel: (req, res) => {
    cards.getHomeCarousels((card) => res.status(200).send(card));
  },

  saveBookmark: function (req, res) {
    private._wrapCon(res, () => {
      const { userID, cardID } = req.body;

      Bookmarks.findOne({ userID }, (err, data) => {
        if (err) express_helper.handle_error(err, res);
        if (data === null) {
          let tmp = new Bookmarks({ userID, cards: [] });
          tmp.cards.push({ id: cardID });
          tmp.save((error, savedCollection) => {
            if (error) express_helper.handle_error(error, res);
            res.send(savedCollection);
          });
        } else {
          let tmp = data.cards.find((item) => item.id === cardID);
          if (tmp) res.send(data);
          else {
            Bookmarks.update(
              { _id: data._id },
              { cards: [...data.cards, { id: cardID }] },
              (error, updatedCollection) => {
                if (error) express_helper.handle_error(error, res);
                res.send(updatedCollection);
              }
            );
          }
        }
      });
    });
  },

  suggestCard: function (req, res) {
    private._wrapCon(res, async () => {
      const { userID, cause, email, description } = req.body;

      const params = {
        Destination: {
          ToAddresses: ["janepress940214@gmail.com"],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<html><body>${description}</body></html>`,
            },

            Text: {
              Charset: "UTF-8",
              Data: description,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: cause,
          },
        },
        Source: "software.dev0218@gmail.com",
      };

      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log("email submitted to SES", data);
          res.status(200).send(data);
        })
        .catch((err) => res.status(400).send(err));
    });
  },

  updateDownloadCount: function (req, res) {
    const { cardID } = req.params;
    private._wrapCon(res, async () => {
      const bookmark = await Bookmarks.findOne({ cardID }).exec();
      const completed = isNaN(bookmark.completed) ? 0 : bookmark.completed;

      const uBookmark = await Bookmarks.findOneAndUpdate(
        { cardID },
        { completed: completed + 1 },
        { new: true }
      );

      res.status(200).send(uBookmark);
    });
  },

  checkBookmarked: function (req, res) {
    private._wrapCon(res, () => {
      const userID = req.params.userID;
      const cardID = req.params.cardID;
      Bookmarks.findOne({ userID }, (err, data) => {
        if (err) express_helper.handle_error(err, res);
        if (data === null) res.send(false);
        else {
          let tmp = data.cards.find((item) => item.id === cardID);
          if (tmp) res.send(true);
          else res.send(false);
        }
      });
    });
  },

  markAsDone: function (req, res) {
    private._wrapCon(res, () => {
      const userID = req.body.userID;
      const cardID = req.body.cardID;

      FinishedCards.findOne({ userID }, (err, data) => {
        if (err) express_helper.handle_error(err, res);
        Profile.findOne({ userID }, (p_err, profile) => {
          if (!p_err && profile !== null) {
            Profile.update(
              { _id: profile._id },
              { points: profile.points + 1 }
            );
          } else if (!p_err && profile === null) {
            let newProfile = new Profile();
            newProfile.userID = userID;
            newProfile.points = 1;
            console.log("saving new profile");
            newProfile.save();
          }
        });
        if (data === null) {
          let tmp = new FinishedCards({ userID, cards: [] });
          tmp.cards.push({ id: cardID });
          tmp.save((error, savedCollection) => {
            if (error) express_helper.handle_error(error, res);
            res.send(savedCollection);
          });
        } else {
          let tmp = data.cards.find((item) => item.id === cardID);
          if (tmp) res.send(data);
          else {
            let newCollection = new FinishedCards(data);
            newCollection.cards.push({ id: cardID });
            FinishedCards.update(newCollection, (error, updatedCollection) => {
              if (error) express_helper.handle_error(error, res);
              res.send(updatedCollection);
            });
          }
        }
      });
    });
  },
  checkIfDone: function (req, res) {
    private._wrapCon(res, () => {
      const userID = req.params.userID;
      const cardID = req.params.cardID;
      FinishedCards.findOne({ userID }, (err, data) => {
        if (err) express_helper.handle_error(err, res);
        if (data === null) res.send(false);
        else {
          let tmp = data.cards.find((item) => item.id === cardID);
          if (tmp) res.send(true);
          else res.send(false);
        }
      });
    });
  },
};
