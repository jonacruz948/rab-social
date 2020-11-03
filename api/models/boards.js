const mongoose = require("mongoose");

const DEFAULT_COVER_IMAGE =
  "https://rabble-dev.s3.amazonaws.com/assets/reactangle.png";

const boardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userID: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    tags: [],
    cards: {
      media: {
        type: Array,
        default: [],
      },
      action: {
        type: Array,
        default: [],
      },
    },
    downloads: {
      type: Number,
      default: 0,
    },
    bookmark: {
      type: Array,
      default: [],
    },
    coverimage: {
      type: String,
      default: DEFAULT_COVER_IMAGE,
    },
    slug: String,
  },
  { timestamps: true }
);

const Board = mongoose.model("boards", boardSchema);

module.exports = Board;
