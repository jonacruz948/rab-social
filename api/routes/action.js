const express = require("express");
const {
  getActionCarousel,
  getActionList,
  getUsersByPoints,
} = require("../controllers/action");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getActionCarousel);
router.get("/:userID/actionlist", auth, getActionList);
router.get("/user-ranking", getUsersByPoints);
module.exports = router;
