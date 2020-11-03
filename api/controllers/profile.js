const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const _ = require("lodash/lang");
var db = require("../database/connection");
const Users = require("../models/users");
const Profile = require("../models/profile");
const Bookmark = require("../models/bookmarks");
const Boards = require("../models/boards");
const Card = require("../models/cards");
const {
  AWS: { accessKeyId, secretAccessKey, region, bucket },
} = require("../config");
var express_helper = require("../helpers/express");
const { BADGES } = require("../schemas/keywords");

var private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

module.exports = {
  getProfile: function (req, res) {
    const { userID } = req.params;

    private._wrapCon(res, async () => {
      try {
        const user = await Users.findById(userID).exec();
        const profile = await Profile.findOne({ userID }).exec();

        const { city, state, email } = user;
        const { bookmarkedboards, createdboards, badges } = profile;

        const badgeData = badges.map((el) =>
          BADGES[el]
            ? {
                ...BADGES[el],
                actionKeyword: el,
              }
            : { ...BADGES["default"], actionKeyword: el }
        );

        let createdBoards = [];
        let bookmarkedBoards = [];

        const allBoards = [
          ...bookmarkedboards.map((item) => ({
            type: "bookmark",
            boardID: item,
          })),
          ...createdboards.map((item) => ({
            type: "created",
            boardID: item,
          })),
        ];

        if (allBoards.length > 0) {
          Promise.all(
            allBoards.map(async (board) => {
              const { type, boardID } = board;
              console.log("real board", board);
              console.log("profile BoardID ===>", boardID);
              if (mongoose.Types.ObjectId(boardID)) {
                const board = await Boards.findById(
                  boardID,
                  "coverimage name userID cards"
                ).exec();
                if (board) {
                  if (type === "bookmark") {
                    const { coverimage, name, userID, cards } = board;
                    const { avatar, fullName } = await Profile.findOne(
                      { userID },
                      "avatar fullName"
                    ).exec();
                    return {
                      type,
                      data: {
                        coverimage,
                        name,
                        avatar,
                        fullName,
                        cards,
                        boardID,
                      },
                    };
                  } else {
                    const { coverimage, name, cards } = board;
                    return {
                      type: "created",
                      data: { coverimage, name, cards, boardID },
                    };
                  }
                } else {
                  return {};
                }
              } else {
                console.log("boardID casting rejection ===>", boardID);
              }
            })
          ).then((completed) => {
            completed
              .filter((el) => !_.isEmpty(el))
              .forEach((item) => {
                if (item.type === "bookmark")
                  bookmarkedBoards.push({ ...item.data });
                if (item.type === "created")
                  createdBoards.push({ ...item.data });
              });

            res.status(200).send({
              result: 0,
              ...profile._doc,
              bookmarkedboards: bookmarkedBoards,
              createdboards: createdBoards,
              badgeData,
              city,
              state,
              email,
            });
          });
        } else {
          res.status(200).send({
            result: 0,
            ...profile._doc,
            bookmarkedboards: [],
            createdboards: [],
            badgeData,
            city,
            state,
            email,
          });
        }
      } catch (error) {
        if (error) express_helper.handle_error(error, res);
      }
    });
  },

  boardStats: (req, res) => {
    const { userID } = req.params;
    private._wrapCon(res, async () => {
      const profile = await Profile.findOne(
        { userID },
        "bkBoardsTimestamp shares"
      ).exec();
      if (profile) {
        const { bkBoardsTimestamp, shares } = profile;
        res.status(200).send({ bkBoardsTimestamp, shares });
      }
    });
  },

  uploadProfileAvatar: (req, res) => {
    const file = req.file;
    const userID = req.params.userID;

    const s3bucket = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    const params = {
      Bucket: `${bucket}/profile-avatars`,
      Key: `${Date.now()}-${file.originalname}`,
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
          Profile.updateOne(
            { userID },
            { $set: { avatar: Location } },
            (err, nProfile) => {
              console.log(nProfile);
              if (err) express_helper.handle_error(err, res);
              res.status(200).send({ result: 0, avatar: Location });
            }
          );
        });
      }
    });
  },

  updateProfile: function (req, res) {
    const { userID } = req.params;

    private._wrapCon(res, async () => {
      const { profile } = req.body;
      const { city, state, _id, ...profileData } = profile;
      const { userName, fullName } = profileData;

      try {
        const uProfile = await Profile.findOneAndUpdate(
          { userID },
          { $set: { ...profileData } },
          { new: true }
        ).exec();

        try {
          await Users.findOneAndUpdate(
            { _id: userID },
            { $set: { city, state, userName, fullName } },
            { new: true }
          ).exec();
        } catch (e) {
          if (e.code === 11000) {
            const message =
              e.keyPattern.userName === 1
                ? "Username is already in use"
                : "Email is duplicated";
            res.status(200).send({ result: 1, message });
          } else {
            return express_helper.handle_error(e, res);
          }
        }

        res.status(200).send({
          result: 0,
          profile: { ...uProfile._doc, city, state, userName, fullName },
        });
      } catch (e) {
        if (e) express_helper.handle_error(e, res);
      }
    });
  },

  actionToProfile: (req, res) => {
    private._wrapCon(res, async () => {
      const { userID } = req.params;
      const { actionID, type, actionKeyword } = req.body;

      try {
        const profile = await Profile.findOne({ userID }).exec();

        if (profile) {
          let actions = [];
          let points = profile.points;
          let badges = profile.badges;

          if (type === 0) {
            // add the action
            if (!profile.actions.includes(actionID)) {
              points += 5;
            }
            actions = [...new Set([...profile.actions, actionID])];
            badges.push(actionKeyword);
          } else {
            // remove the action
            actions = profile.actions;
            actions.splice(
              actions.findIndex((el) => el === actionID),
              1
            );
            if (points > 5) points -= 5;
          }

          const bookmark = await Bookmark.findOne({ cardID: actionID }).exec();
          const completed = isNaN(bookmark.completed) ? 0 : bookmark.completed;

          const uBookmark = await Bookmark.findOneAndUpdate(
            { cardID: actionID },
            { completed: completed + 1 },
            { new: true }
          );

          Profile.findOneAndUpdate(
            { userID },
            { actions, points, badges },
            { new: true },
            (err, uProfile) => {
              if (err) express_helper.handle_error(err, res);
              res.status(200).send(uBookmark);
            }
          );
        } else {
          const actions = [actionID];
          const badges = [actionKeyword];
          Profile.create({ userID, actions, badges }, (err) => {
            if (err) express_helper.handle_error(err, res);
            res.status(200).send({ resultCode: 0 });
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
  },

  getActionData: (req, res) => {
    const { userID } = req.params;

    private._wrapCon(res, async () => {
      try {
        const { actions } = await Profile.findOne({ userID }, "actions").exec();
        if (actions.length > 0) {
          Promise.all(
            actions.map(async (cardID) => {
              const { id, title, dateofEvent } = await Card.getCardByID(cardID);
              const bookmark = await Bookmark.findOne({ cardID }).exec();

              return bookmark
                ? { id, title, dateofEvent, slug: bookmark.slug }
                : { id, title, dateofEvent };
            })
          ).then((actionData) => {
            res.status(200).send({ actionData });
          });
        } else {
          res.status(200).send({ actionData: [] });
        }
      } catch (e) {
        console.log(e);
      }
    });
  },
};
