const contentful = require("contentful");
const documentToHtmlString = require("@contentful/rich-text-html-renderer")
  .documentToHtmlString;

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "vrge56wk83zg",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "bpOThBh2VT1pa1ICWJWRYvea33D9yZpu2aE0eSXS_zA",
});

var private = {
  transform: function (data) {
    let card = {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      title: data.fields.cardTitle,
      description: documentToHtmlString(data.fields.cardDescription),
      nonProfitsngOs: data.fields.nonProfitsngOs,
      tags: data.fields.tags,
      media: data.fields.media.fields ? data.fields.media.fields.file.url : "",
      type: data.fields.type,
      keyPointsDescription: data.fields.keyPointsDescription
        ? documentToHtmlString(data.fields.keyPointsDescription)
        : "",
      action: data.fields.actionUrl,
      dateOfEvent: data.fields.dateofEvent,
      location: data.fields.location,
      causes: data.fields.causes,

      orginization: {
        name: data.fields.orginization
          ? data.fields.orginization.fields.name
          : "",
        title: data.fields.orginization
          ? data.fields.orginization.fields.title
          : "",
        description: data.fields.orginization
          ? documentToHtmlString(data.fields.orginization.fields.description)
          : "",
        website: data.fields.orginization
          ? data.fields.orginization.fields.website
          : "",
      },
    };
    return card;
  },

  transformContentCard: function (data) {
    const {
      fields,
      sys: { id, createdAt },
    } = data;
    const {
      cardTitle: title,
      cardDescription,
      tags,
      type,
      downloadMp4,
      downloadJpg,
      relatedActions,
      location,
      causes,
    } = fields;

    const downloadJpgFiles = downloadJpg
      ? downloadJpg.map((item) => item.fields)
      : [];
    const downloadFields = downloadMp4
      ? downloadMp4.map((item) => item.fields)
      : [];

    const raActions = relatedActions
      ? relatedActions.map((item) => {
          const {
            fields: relatedActionsFields,
            sys: { id: raActionId },
          } = item;
          const {
            cardTitle: raCardTitle,
            cardDescription: raCardDescription,
            tags: raTags,
            media: raMedia,
            fields: raCardFields,
            type: raType,
            actionUrl: raActionUrl,
          } = relatedActionsFields;
          const raFields = {
            raCardTitle,
            raCardDescription: documentToHtmlString(raCardDescription),
            raTags,
            raMedia,
            raCardFields,
            raType,
            raActionUrl,
            raActionId,
          };

          return raFields;
        })
      : [];

    return {
      id,
      createdAt,
      title,
      description: documentToHtmlString(cardDescription),
      tags,
      type,
      downloadFields,
      downloadJpgFiles,
      raActions,
      location,
      causes,
    };
  },

  transformActionPageData: function (data) {
    const {
      fields,
      sys: { id },
    } = data;
    const { title, images } = fields;
    const imagesToDisplay = images.map((el) => {
      const {
        fields: {
          title,
          file: { url },
        },
      } = el;
      return { title, url };
    });

    return { title, imagesToDisplay };
  },
};

var cards_model = {
  all: function (callback) {
    client
      .getEntries({
        content_type: "card",
        include: 4,
      })
      .then((entries) => {
        return callback(entries.items.map((entry) => private.transform(entry)));
        // callback(entries.items.map((entry) => entry));
      })
      .catch((e) => {
        console.log("getting an error while getting contentful cards: ", e);
        cards = [];
        return callback(cards);
      });
  },

  allContentCards: function (callback) {
    client
      .getEntries({
        content_type: "contentCard",
      })
      .then((entries) => {
        callback(
          entries.items.map((entry) => private.transformContentCard(entry))
          // entries.items.map((entry) => entry)
        );
      });
  },

  allByDateRange: async (callback) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const newDay = currentDate.getDate();
    const newMonth = currentDate.getMonth();
    const newYear = currentDate.getFullYear();

    const actionCardsEntries = await client.getEntries({
      "sys.createdAt[gt]": new Date(newYear, newMonth, newDay),
      content_type: "card",
      limit: 1000,
    });

    const mediaCardsEntries = await client.getEntries({
      "sys.createdAt[gt]": new Date(newYear, newMonth, newDay),
      content_type: "contentCard",
      limit: 1000,
    });

    let actionCards = actionCardsEntries.items.map((entry) =>
      private.transform(entry)
    );
    let mediaCards = mediaCardsEntries.items.map((entry) =>
      private.transformContentCard(entry)
    );

    return callback([...actionCards, ...mediaCards]);
  },

  byType: function (cardType, callback) {
    client
      .getEntries({
        content_type: "card",
        include: 4,
        "fields.type": cardType,
      })
      .then((entries) => {
        cards = [];
        for (var i = 0; i < entries.items.length; i++) {
          cards.push(private.transform(entries.items[i]));
        }
        callback(null, cards);
      })
      .catch((error) => {
        callback(error, []);
      });
  },

  byTag: async function (tags, callback) {
    const actionCardsEntries = await client.getEntries({
      content_type: "card",
      limit: 6,
      include: 4,
      "fields.tags[in]": tags,
    });
    const mediaCardsEntries = await client.getEntries({
      content_type: "contentCard",
      limit: 6,
      include: 4,
      "fields.tags[in]": tags,
    });

    let actionCards = actionCardsEntries.items.map((entry) =>
      private.transform(entry)
    );
    let mediaCards = mediaCardsEntries.items.map((entry) =>
      private.transformContentCard(entry)
    );

    return callback([...actionCards, ...mediaCards]);
  },

  byId: function (entryId, callback) {
    return client
      .getEntry(entryId)
      .then((entry) => {
        const { fields } = entry;
        if (fields.type === "media") {
          return callback(null, private.transformContentCard(entry));
        } else {
          return callback(null, private.transform(entry));
        }
      })
      .catch((err) => callback(err, {}));
  },

  searchByWords: async function (word, callback) {
    const actionCardsEntries = await client.getEntries({
      content_type: "card",
      include: 4,
      query: word,
    });

    const mediaCardsEntries = await client.getEntries({
      content_type: "contentCard",
      include: 4,
      query: word,
    });

    let actionCards = actionCardsEntries.items.map((entry) =>
      private.transform(entry)
    );
    let mediaCards = mediaCardsEntries.items.map((entry) =>
      private.transformContentCard(entry)
    );

    return callback([...actionCards, ...mediaCards]);
  },

  getByLocation: (location, callback) => {
    return client
      .getEntries({
        content_type: "card",
        limit: 100,
      })
      .then((entries) => {
        callback(entries.items.map((entry) => private.transform(entry)));
      });
  },

  getCardByID: async (cardID) => {
    const entry = await client.getEntry(cardID);

    if (entry) {
      const { fields } = entry;
      if (fields.type === "media") {
        return private.transformContentCard(entry);
      } else {
        return private.transform(entry);
      }
    }
  },

  getActionCarousel: (callback) => {
    return client
      .getEntries({
        content_type: "actionDisplay",
      })
      .then((entries) => {
        // callback(entries.items.map((entry) => private.transform(entry)));
        callback(
          entries.items.map((entry) => private.transformActionPageData(entry))
        );
      });
  },

  getExploreCarousel: (callback) => {
    return client
      .getEntries({
        content_type: "explore",
      })
      .then((entries) => {
        // callback(entries.items.map((entry) => private.transform(entry)));
        callback(
          entries.items.map((entry) => private.transformActionPageData(entry))
        );
      });
  },

  getHomeCarousels: (callback) => {
    return client
      .getEntries({
        content_type: "notAuthenticatedHome",
      })
      .then((entries) => {
        callback(
          entries.items.map((entry) => private.transformActionPageData(entry))
        );
      });
  },
};

module.exports = cards_model;
