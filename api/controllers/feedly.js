const axios = require("axios");
const _ = require("lodash/lang");
const Board = require("../models/boards");
const Profile = require("../models/profile");
var db = require("../database/connection");
const { FEEDLY } = require("../config");

const { userId, accessToken } = FEEDLY;
const FEEDLY_API_ENDPOINTS = "https://cloud.feedly.com/v3";
const STREAM_ENDPOINT = `${FEEDLY_API_ENDPOINTS}/streams/contents?streamId=user/144dd781-4fbe-4539-a90a-33ef9c11be77/category/global.all&count=5`;

var private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

module.exports = {
  getFeedlyNews: (req, res) => {
    const Authorization = `Bearer ${accessToken}`;

    axios
      .get(STREAM_ENDPOINT, {
        headers: {
          Authorization,
        },
      })
      .then(async (result) => {
        const { items } = result.data;

        let keywords = [];
        items.forEach(
          (feed) => feed.keywords && keywords.push(...feed.keywords)
        );

        let oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 2);
        const oldDay = oldDate.getDate();
        const oldMonth = oldDate.getMonth();
        const oldYear = oldDate.getFullYear();

        let currentDate = new Date();
        const newDay = currentDate.getDate();
        const newMonth = currentDate.getMonth();
        const newYear = currentDate.getFullYear();

        private._wrapCon(res, async () => {
          const boards = await Board.find(
            {
              updatedAt: {
                $gte: new Date(oldYear, oldMonth, oldDay),
                // $lt: new Date(newYear, newMonth, newDay),
              },
            },
            "tags _id coverimage name cards userID"
          )
            .limit(20)
            .exec();

          Promise.all(
            boards.map(async (board) => {
              const { tags, userID, _id, coverimage, name, cards } = board;
              const uTags = tags.map((tag) =>
                tag.replace(/[^a-zA-Z]+/g, "").toLowerCase()
              );
              const intersection = keywords.filter((el) =>
                uTags.includes(el.replace(/[^a-zA-Z]+/g, "").toLowerCase())
              );

              if (intersection.length > 0) {
                const { fullName, avatar } = await Profile.findOne(
                  { userID },
                  "fullName avatar"
                ).exec();
                return {
                  matchCount: intersection.length,
                  board: { _id, coverimage, name, cards, avatar, fullName },
                };
              } else {
                return {};
              }
            })
          ).then((filteredBoard) => {
            const tempBoard = filteredBoard
              .filter((tmp) => !_.isEmpty(tmp))
              .sort((fir, sec) => sec.matchCount - fir.matchCount);

            res.status(200).send({ items, tempBoard });
          });
        });
      });
  },
};
