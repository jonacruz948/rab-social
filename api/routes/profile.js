const express = require("express");
const multer = require("multer");

const auth = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const {
  getProfile,
  actionToProfile,
  updateProfile,
  uploadProfileAvatar,
  getActionData,
  boardStats,
} = require("../controllers/profile");

const router = express.Router();

router.get("/:userID", getProfile);
router.put("/:userID", actionToProfile);
router.get("/:userID/get-actions", auth, getActionData);
router.post("/:userID/update", auth, updateProfile);
router.post("/:userID/upload-avatar", auth, upload, uploadProfileAvatar);
router.get("/:userID/boardstats", auth, boardStats);

module.exports = router;
