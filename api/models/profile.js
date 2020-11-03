const mongoose = require("mongoose");

const DEFAULT_AVATAR = "https://rabble-dev.s3.amazonaws.com/assets/user.jpeg";

const profileSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
  },
  bio: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
  },
  userName: {
    type: String,
  },
  createdboards: {
    type: Array,
    default: [],
  },
  tags: {
    media: [],
    action: [],
    board: [],
  },
  bookmarkedcards: [
    {
      cardID: {
        type: String,
      },
      boardID: {
        type: String,
      },
    },
  ],
  bookmarkedboards: {
    type: Array,
    default: [],
  },
  bkBoardsTimestamp: [
    {
      boardID: String,
      timestamps: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  searches: [
    {
      keyword: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  views: [
    {
      type: {
        type: String,
      },
      id: {
        type: String,
      },
    },
  ],
  points: {
    type: Number,
    default: 0,
  },
  downloads: [
    {
      type: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  ],
  shares: [
    {
      boardID: String,
      timestamps: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  actions: {
    type: Array,
    default: [],
  },
  badges: [],
});

const Profile = mongoose.model("profiles", profileSchema);

module.exports = Profile;
