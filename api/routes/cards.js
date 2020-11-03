const express = require("express");
const {
  getAll,
  getAllContentCard,
  getOne,
  getNewsCard,
  getAllBookmark,
  homeCarousel,
  removeBookmark,
  checkBookmarked,
  markAsDone,
  checkIfDone,
  suggestCard,
  bookmarkCardToBoard,
  updateDownloadCount,
} = require("../controllers/cards");

const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getAll);
router.get("/allcontentcards", getAllContentCard);
router.get("/carousel", homeCarousel);
router.post("/suggestcard", suggestCard);
router.get("/bookmarks", getAllBookmark);
router.get("/:id", getOne);
router.post("/:cardID", auth, updateDownloadCount);
router.put("/bookmark/add", auth, bookmarkCardToBoard);
router.post("/bookmark/remove", auth, removeBookmark);
router.get("/special/news", getNewsCard);
// router.post('/bookmark/add', auth, saveBookmark);
router.get("/bookmark/:userID/:cardID", auth, checkBookmarked);
router.post("/mark/done", auth, markAsDone);
router.get("/mark/:userID/:cardID", auth, checkIfDone);
router.post("/suggest", auth, suggestCard);

module.exports = router;
