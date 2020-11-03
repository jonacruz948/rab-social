const express = require("express");
const multer = require("multer");

const auth = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const {
  createBoard,
  addCardToBoard,
  getBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  bookmarkBoard,
  removeBookmark,
  getRecommendations,
  boardCoverImageUpload,
  deleteCardsFromBoard,
  getShortenURL,
  getBookmarkBoards,
  findMoreIdeaCards,
  shareBoardCount,
} = require("../controllers/boards");
const router = express.Router();

router.get("/getshortenurl", auth, getShortenURL);
router.get("/", getBoards);
router.post("/createboard", auth, upload, createBoard);
router.post("/addcardtoboard", auth, addCardToBoard);
router.get("/get-recommendations", auth, getRecommendations);
router.post("/upload", auth, upload, boardCoverImageUpload);
router.get("/:id", getBoard);
router.post("/:boardID", auth, shareBoardCount);
router.put("/update", auth, updateBoard);
router.put("/:id/deletecards", auth, deleteCardsFromBoard);
router.delete("/remove", auth, deleteBoard);
router.get("/:boardID/more-ideas", findMoreIdeaCards);
router.get("/:id/bookmark-boards", auth, getBookmarkBoards);
router.put("/bookmark/add", auth, bookmarkBoard);
router.delete("/bookmark/remove", auth, removeBookmark);

module.exports = router;
