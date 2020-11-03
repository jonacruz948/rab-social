const CronJob = require("cron").CronJob;
const shortid = require("shortid");
const _ = require("lodash/collection");

const db = require("../database/connection");
const Card = require("../models/cards");
const Bookmark = require("../models/bookmarks");

const private = {
  _wrapCon: function (res, callback) {
    db.connect().then(callback, () => {
      express_helper.handle_error(err, res);
    });
  },
};

const job = new CronJob(
  "0 */45 * * * *",
  function () {
    db.connect().then(async () => {
      const storedCards = await Bookmark.find({}).exec();
      const cardInfoWithSlug = {};
      storedCards.forEach(
        (el) => (cardInfoWithSlug[el.cardID] = { slug: el.slug })
      );

      const cardsFromContentful = await Card.allByDateRange((cards) => cards);
      Promise.all(
        cardsFromContentful.map(async (card) => {
          const { id: cardID } = card;
          if (!cardInfoWithSlug[cardID]) {
            const { title } = card;
            const slug = `${title
              .replace(/[^a-zA-Z ]/g, "")
              .replace(/\s/g, "-")}-${shortid.generate()}`;

            try {
              const bookmark = await Bookmark.updateOne(
                { cardID },
                { $set: { slug } },
                { upsert: true }
              );
              return bookmark;
            } catch (e) {
              console.log(e);
            }
          } else {
            return undefined;
          }
        })
      ).then((completed) => {});
    });
  },
  null,
  true,
  "America/Los_Angeles"
);

module.exports = job;
