const express = require("express");
const {
  getExploreCarousel,
  getTrendCards,
  getTrendBoards,
  getCardsByBoardTags,
  getCardsByLocation,
  searchbyWord,
} = require("../controllers/explore");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getExploreCarousel);
router.get("/trends", getTrendCards);
router.get("/trendboards", getTrendBoards);
router.get("/:userID/cardsbyboardtags", auth, getCardsByBoardTags);
router.get("/:userID/cardsbylocation", auth, getCardsByLocation);
router.get("/search", searchbyWord);
module.exports = router;
