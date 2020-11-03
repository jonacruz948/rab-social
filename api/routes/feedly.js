const express = require("express");
const router = express.Router();

const { getFeedlyNews } = require("../controllers/feedly");

router.get("/", getFeedlyNews);

module.exports = router;
