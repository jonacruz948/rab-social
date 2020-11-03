const mongoose = require("mongoose");
const _ = require("lodash");
const NodeGeocoder = require("node-geocoder");
const stringSimilarity = require("string-similarity");
const shortid = require("shortid");
const Fuse = require("fuse.js");

const Card = require("../models/cards");
const Bookmark = require("../models/bookmarks");
const Board = require("../models/boards");
const Profile = require("../models/profile");
const User = require("../models/users");
const db = require("../database/connection");
const express_helper = require("../helpers/express");

//AIzaSyAxnD5Yfll6FYErBZR1nMsQEjh67PDHvu0
const options = {
  provider: "google",
  apiKey: "AIzaSyAxnD5Yfll6FYErBZR1nMsQEjh67PDHvu0",
  formatter: "string",
  formatterPattern: "%c",
};

const geocoder = NodeGeocoder(options);

const private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

const getExploreCarousel = (req, res) => {
  Card.getExploreCarousel((card) => {
    res.status(200).send(card);
  });
};

const getTrendCards = (req, res) => {
  private._wrapCon(res, async () => {
    const allCards = await Bookmark.find({}, "bookmark cardID slug").exec();
    const cards = allCards
      .sort((fir, sec) => sec.bookmark - fir.bookmark)
      .slice(0, 10);

    Promise.all(
      cards.map(
        async (cardItem) =>
          await Card.byId(cardItem.cardID, (err, card) => {
            if (!err) {
              return card.type !== "media" && { slug: cardItem.slug, ...card };
            }
          })
      )
    ).then((cardData) => {
      let cardsToSend = cardData.filter((item) => item);
      res.status(200).send(cardsToSend);
    });
  });
};

const getTrendBoards = (req, res) => {
  private._wrapCon(res, async () => {
    const boards = await Board.find(
      {},
      "name cards userID bookmark coverimage _id"
    ).exec();

    const rankedBoards = boards
      .sort((fir, sec) => sec.bookmark.length - fir.bookmark.length)
      .slice(0, 10);

    Promise.all(
      rankedBoards.map(async (board) => {
        const { userID, name, cards, coverimage, _id } = board;
        const profile = await Profile.findOne(
          { userID },
          "avatar fullName"
        ).exec();

        if (profile) {
          const { avatar, fullName } = profile;
          return { avatar, fullName, name, cards, coverimage, id: _id };
        } else {
          return {};
        }
      })
    )
      .then((boardData) => {
        const rBoards = boardData.filter((board) => !_.isEmpty(board));
        res.status(200).send(rBoards);
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  });
};

const getCardsByBoardTags = (req, res) => {
  const { userID } = req.params;

  private._wrapCon(res, async () => {
    const { bookmarkedboards } = await Profile.findOne(
      { userID },
      "bookmarkedboards"
    ).exec();

    if (_.slice(bookmarkedboards, 0, 2).length > 0) {
      Promise.all(
        _.slice(bookmarkedboards, 0, 2).map(async (boardID) => {
          if (mongoose.Types.ObjectId.isValid(boardID)) {
            const { tags, cards, name } = await Board.findById(
              boardID,
              "tags cards name"
            ).exec();

            return { tags, cards, name };
          }
        })
      ).then(async (boardData) => {
        Promise.all(
          boardData.map(async (elBoard) => {
            const { tags } = elBoard;
            let filteredCards = [];
            const uCard = await Card.byTag(tags.join(","), (card) => card);
            filteredCards = [...filteredCards, ...uCard];

            let cardsWithSlug = [];
            for (let i = 0; i < uCard.length; i++) {
              const { id: cardID } = uCard[i];
              const bookmark = await Bookmark.findOne({ cardID }).exec();
              cardsWithSlug = bookmark
                ? [...cardsWithSlug, { ...uCard[i], slug: bookmark.slug }]
                : [...cardsWithSlug, uCard[i]];
            }
            return { filteredCards: cardsWithSlug, name: elBoard.name };
          })
        ).then((filCards) => {
          res.status(200).send(filCards);
        });
      });
    } else {
      res.status(200).send([]);
    }
  });
};

const getCardsByLocation = (req, res) => {
  const { userID } = req.params;

  private._wrapCon(res, async () => {
    const { city } = await User.findById(userID, "city").exec();

    Card.getByLocation(city, async (card) => {
      let cardToSend = _.remove(card, (el) => el.location);
      Promise.all(
        cardToSend.map(async (elCard) => {
          const res = await geocoder.reverse({ ...elCard.location });
          if (stringSimilarity.compareTwoStrings(res[0], city) > 0.5) {
            const { id: cardID } = elCard;
            const bookmark = await Bookmark.findOne({ cardID }, "slug").exec();

            return bookmark
              ? { ...elCard, slug: bookmark.slug, location: res[0] }
              : { ...elCard, location: res[0] };
          } else {
            return {};
          }
        })
      ).then((cards) => {
        _.remove(cards, (el) => _.isEmpty(el));
        res.status(200).send(cards);
      });
    });
  });
};

const searchbyWord = async (req, res) => {
  const { searchWords } = req.query;

  private._wrapCon(res, async () => {
    const allBoards = await Board.find({}).exec();

    const options = {
      includeScore: true,
      keys: ["tags", "name", "bio"],
    };

    const fuse = new Fuse(allBoards, options);

    const boardResult = fuse
      .search(searchWords)
      .sort((fir, sec) => fir.score - sec.score)
      .map((el) => el.item);

    Card.searchByWords(searchWords, (cardData) => {
      Promise.all(
        cardData.map(async (cardItem) => {
          const { id: cardID, title } = cardItem;
          const bookmark = await Bookmark.findOne({ cardID }, "slug").exec();
          if (bookmark) {
            return { slug: bookmark.slug, ...cardItem };
          } else {
            const slug = `${title
              .replace(/[^a-zA-Z ]/g, "")
              .replace(/\s/g, "-")}-${shortid.generate()}`;

            try {
              await Bookmark.updateOne(
                { cardID },
                { $set: { slug, cardID, completed: 0, title } },
                { upsert: true }
              );
              return { slug, ...cardItem };
            } catch (e) {
              console.log(e);
              res.status(500).send(e);
            }
          }
        })
      ).then((cardData) => {
        res.status(200).send({ cards: cardData, filteredBoards: boardResult });
      });
    });
  });
};

module.exports = {
  getExploreCarousel,
  getTrendCards,
  getCardsByBoardTags,
  getCardsByLocation,
  getTrendBoards,
  searchbyWord,
};
