const bcrypt = require("bcryptjs");
const _ = require("lodash/lang");
const { sign, decode } = require("jsonwebtoken");
const Profile = require("../models/profile");
const User = require("../models/users");
const Admin = require("../models/admin");
const Board = require("../models/boards");
const Bookmark = require("../models/bookmarks");
const Section = require("../models/sections");
const Card = require("../models/cards");
const db = require("../database/connection");
const express_helper = require("../helpers/express");

const saltRounds = 10;

const private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

const createNewSection = (req, res) => {
  const { boards, cards, tags, sectionTitle } = req.body;

  private._wrapCon(res, async () => {
    const section = await Section.create({ boards, cards, tags, sectionTitle });
    res.status(200).send({
      result: 0,
      section,
    });
  });
};

const removeSection = (req, res) => {
  const { sectionID } = req.body;
  private._wrapCon(res, async () => {
    await Section.findByIdAndRemove(sectionID).exec();
    const sections = await Section.find({}).exec();

    res.status(200).send({ sections });
  });
};

const updateSection = (req, res) => {
  const { sectionID, boards, cards, tags, sectionTitle } = req.body;
  private._wrapCon(res, async () => {
    await Section.updateOne(
      { _id: sectionID },
      { boards, cards, tags, sectionTitle }
    );
    const sections = await Section.find({}).exec();

    res.status(200).send({ sections });
  });
};

const getSection = (req, res) => {
  const { sectionID } = req.params;

  private._wrapCon(res, async () => {
    const section = await Section.findById(sectionID).exec();
    res.status(200).send({ section });
  });
};

const getAllSections = (req, res) => {
  private._wrapCon(res, async () => {
    const sections = await Section.find({}).exec();
    res.status(200).send({ sections });
  });
};

const getAllBoards = (req, res) => {
  private._wrapCon(res, async () => {
    const allBoards = await Board.find({}).exec();
    Promise.all(
      allBoards.map(async (board) => {
        const { cards, userID } = board;
        let cardData = [];
        const cardIDs = [...cards.media, ...cards.action];

        for (let i = 0; i < cardIDs.length; i++) {
          try {
            const card = await Card.getCardByID(cardIDs[i]);
            cardData.push(card);
          } catch (e) {
            console.log(e);
          }
        }

        const profile = await Profile.findOne({ userID }).exec();
        if (profile) {
          return {
            result: 0,
            cards: cardData,
            board,
            avatar: profile.avatar,
            boardOwner: profile.fullName,
          };
        } else {
          return {};
        }
      })
    ).then((boardData) => {
      const filteredBoards = boardData.filter(
        (boardItem) => !_.isEmpty(boardItem)
      );
      res.status(200).send({ boardData: filteredBoards });
    });
  });
};

const getAllMediaCards = (req, res) => {
  Card.allContentCards((cards) => {
    private._wrapCon(res, () => {
      Promise.all(
        cards.map(async (card) => {
          const { id: cardID } = card;
          const bookmark = await Bookmark.findOne(
            { cardID },
            "bkUsers slug"
          ).exec();
          if (bookmark && bookmark.bkUsers.length > 0) {
            const { bkUsers, slug } = bookmark;
            return { card: { ...card, slug }, bkUsers };
          } else {
            return { card, bkUsers: [] };
          }
        })
      ).then((cardData) => {
        let allBkUsers = [];

        cardData.forEach((cardItem) => {
          const { bkUsers } = cardItem;
          if (bkUsers.length > 0) {
            allBkUsers = [...allBkUsers, ...bkUsers];
          }
        });
        Promise.all(
          allBkUsers.map(async (userID) => {
            const profile = await Profile.findOne(
              { userID },
              "fullName avatar"
            ).exec();

            if (profile) {
              const { fullName, avatar } = profile;
              return { userID, fullName, avatar };
            } else {
              return {};
            }
          })
        ).then((userInfo) => {
          const userData = userInfo.filter((user) => !_.isEmpty(user));
          res.status(200).send({ cardData, userData });
        });
      });
    });
  });
};

const getAllActionCards = (req, res) => {
  Card.all((cards) => {
    private._wrapCon(res, () => {
      Promise.all(
        cards.map(async (card) => {
          const { id: cardID } = card;
          const bookmark = await Bookmark.findOne(
            { cardID },
            "bkUsers slug"
          ).exec();
          if (bookmark && bookmark.bkUsers.length > 0) {
            const { bkUsers, slug } = bookmark;
            return { card: { ...card, slug }, bkUsers };
          } else {
            return { card, bkUsers: [] };
          }
        })
      ).then((cardData) => {
        let allBkUsers = [];

        cardData.forEach((cardItem) => {
          const { bkUsers, id: cardID } = cardItem;
          if (bkUsers.length > 0) {
            allBkUsers = [...allBkUsers, ...bkUsers];
          }
        });
        Promise.all(
          allBkUsers.map(async (userID) => {
            const profile = await Profile.findOne(
              { userID },
              "fullName avatar bookmarkedcards"
            ).exec();

            if (profile) {
              const { fullName, avatar, bookmarkedcards } = profile;
              // const index = bookmarkedcards.findIndex(
              //   (bkCard) => bkCard.cardID === cardID
              // );

              return {
                userID,
                fullName,
                avatar,
                // boardID: bookmarkedcards[index].boardID,
              };
              // if (index !== -1) {
              //   return {
              //     userID,
              //     fullName,
              //     avatar,
              //     boardID: bookmarkedcards[index].boardID,
              //   };
              // } else {
              //   return {
              //     userID,
              //     fullName,
              //     avatar,
              //     boardID: null,
              //   };
              // }
            } else {
              return {};
            }
          })
        ).then((userInfo) => {
          const userData = userInfo.filter((user) => !_.isEmpty(user));
          res.status(200).send({ cardData, userData });
        });
      });
    });
  });
};

const getAllUsers = (req, res) => {
  private._wrapCon(res, async () => {
    try {
      const allUsers = await User.find();
      const allProfile = await Profile.find();
      res.status(200).send({ allUsers, allProfile });
    } catch (e) {
      res.status(404).send(e);
    }
  });
};

const registerAdmin = (req, res) => {
  const { fullName, email, password } = req.body;
  private._wrapCon(res, async () => {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await Admin.create({ fullName, email, password: hash });
      const admin_token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: email,
        },
        "secret"
      );

      res.status(200).send({ result: 0, admin_token });
    });
  });
};

const loginAdmin = (req, res) => {
  const { email, password } = req.body;
  private._wrapCon(res, async () => {
    const admin = await Admin.findOne({ email }).exec();
    if (admin) {
      bcrypt.compare(password, admin.password, (err, result) => {
        if (result) {
          const admin_token = sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
              data: email,
            },
            "secret"
          );
          res
            .status(200)
            .send({ result: 0, admin_token, fullName: admin.fullName });
        } else {
          res.status(200).send({ result: 1 });
        }
      });
    } else {
      res.status(200).send({ result: 1 });
    }
  });
};

const registerTags = (req, res) => {
  const { email, tags } = req.body;
  private._wrapCon(res, async () => {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email },
      { tags },
      { new: true }
    ).exec();
    res.status(200).send({ result: 0, admin: updatedAdmin });
  });
};

const removeUser = (req, res) => {
  const { userID } = req.body;
  private._wrapCon(res, async () => {
    const user = await User.findByIdAndRemove(userID);
    const profile = await Profile.findOneAndRemove({ userID });
    res.status(200).send({ user, profile });
  });
};

const dropUserCollection = (req, res) => {
  const { collection } = req.body;
  db.dropCollection(collection, (err, result) => {
    console.log(`${collection} deleted successfully`);
    res.status(200).send(`${collection} deleted successfully`);
  });
};

module.exports = {
  createNewSection,
  removeSection,
  updateSection,
  getAllSections,
  getSection,
  getAllUsers,
  removeUser,
  dropUserCollection,
  registerAdmin,
  loginAdmin,
  registerTags,
  getAllBoards,
  getAllMediaCards,
  getAllActionCards,
};
