const mongoose = require("mongoose");

const bookmarkSchema = mongoose.Schema(
  {
    cardID: {
      type: String,
      required: true,
    },
    bookmark: {
      type: Number,
      default: 0,
    },
    bkUsers: {
      type: Array,
      default: [],
    },
    slug: String,
    title: String,
    completed: Number,
    searchKeywords: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Bookmarks = mongoose.model("bookmarks", bookmarkSchema);

module.exports = Bookmarks;
