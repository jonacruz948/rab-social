const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    cardID: {
      type: String,
    },
    boardID: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
