const express = require("express");

const auth = require("../middleware/auth");
const { getSpecificTypeformResponse } = require("../controllers/typeform");
const router = express.Router();

router.get("/response", auth, getSpecificTypeformResponse);

module.exports = router;
