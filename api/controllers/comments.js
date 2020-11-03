const _ = require("lodash/lang");

var db = require("../database/connection");
const Comments = require("../models/comments");
const Profile = require("../models/profile");

var express_helper = require("../helpers/express");

var private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

module.exports = {
  getComments: function (req, res) {
    private._wrapCon(res, () => {
      const { cardID } = req.params;

      Comments.find(
        { cardID },
        null,
        { sort: { createdAt: -1 } },
        async (error, comments) => {
          if (error) express_helper.handle_error(error, res);
          Promise.all(
            comments.map(async (comment) => {
              const { userID, message, cardID, createdAt } = comment;
              const profile = await Profile.findOne(
                { userID },
                "fullName avatar"
              ).exec();

              if (profile) {
                const { fullName, avatar } = profile;
                return { fullName, avatar, message, cardID, userID, createdAt };
              } else {
                return {};
              }
            })
          ).then((commentData) => {
            const fComments = commentData.filter(
              (comment) => !_.isEmpty(comment)
            );
            res.status(200).send({ comments: fComments });
          });
        }
      );
    });
  },

  addComment: function (req, res) {
    private._wrapCon(res, async () => {
      const { userID, cardID, message, createdAt } = req.body;
      console.log(userID, cardID, message);

      await Comments.create({ userID, cardID, message });
      Comments.find(
        { cardID },
        null,
        { sort: { createdAt: -1 } },
        async (error, comments) => {
          if (error) express_helper.handle_error(error, res);
          Promise.all(
            comments.map(async (comment) => {
              const { userID, message, cardID, createdAt } = comment;
              const profile = await Profile.findOne(
                { userID },
                "fullName avatar"
              ).exec();

              if (profile) {
                const { fullName, avatar } = profile;
                return { fullName, avatar, message, cardID, userID, createdAt };
              } else {
                return {};
              }
            })
          ).then((commentData) => {
            const fComments = commentData.filter(
              (comment) => !_.isEmpty(comment)
            );
            res.status(200).send({ comments: fComments });
          });
        }
      );
    });
  },
};
