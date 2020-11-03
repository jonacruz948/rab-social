const mongoose = require("mongoose");

const Card = require("../models/cards");
const Profile = require("../models/profile");
const Board = require("../models/boards");
const Bookmark = require("../models/bookmarks");
const db = require("../database/connection");
const express_helper = require("../helpers/express");

const private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

const getActionCarousel = (req, res) => {
  Card.getActionCarousel((card) => {
    res.status(200).send(card);
  });
};

const getActionList = (req, res) => {
  const { userID } = req.params;

  private._wrapCon(res, async () => {
    const { createdboards } = await Profile.findOne(
      { userID },
      "createdboards"
    ).exec();

    if (createdboards.length > 0) {
      Promise.all(
        createdboards.map(async (boardID) => {
          const board = await Board.findById(boardID, "cards").exec();
          return board ? [...board.cards.action] : null;
        })
      ).then((actions) => {
        let actionIDs = [];
        actions
          .filter((el) => el)
          .forEach((item) => item.forEach((el) => actionIDs.push(el)));
        actionIDs = [...new Set(actionIDs)];
        Promise.all(
          actionIDs.map(async (cardID) => {
            const { id, dateOfEvent, title } = await Card.getCardByID(
              cardID,
              (card) => card
            );
            const bookmark = await Bookmark.findOne({ cardID }, "slug").exec();

            return bookmark
              ? { id, dateOfEvent, slug: bookmark.slug, title }
              : { id, dateOfEvent, title };
          })
        ).then((actionCards) => {
          res.status(200).send({ result: 0, actionList: actionCards });
        });
      });
    } else {
      res.status(200).send({ result: 1, message: "No action list" });
    }
  });
};

const getUsersByPoints = (req, res) => {
  private._wrapCon(res, async () => {
    const profiles = await Profile.find({}, "userName avatar points userID")
      .sort({ points: -1 })
      .limit(5)
      .exec();
    res.status(200).send({ profiles });
  });
};

module.exports = {
  getActionCarousel,
  getActionList,
  getUsersByPoints,
};
