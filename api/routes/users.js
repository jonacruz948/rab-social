const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const {
  register,
  login,
  logout,
  loginWithSocial,
} = require("../controllers/auth");
const { getBoardsByUser } = require("../controllers/boards");

const auth = require("../middleware/auth");
const validation = require("../middleware/validation");
const { registerSchema, loginSchema } = require("../schemas");
const router = express.Router();

router.post("/register", upload, validation(registerSchema), register);
router.post("/login", validation(loginSchema), login);
router.post("/login-with-social", loginWithSocial);
router.post("/me/logout", logout);
router.get("/ping", auth, (req, res) => res.send({ result: "valid" }));
router.get("/me/boards", auth, getBoardsByUser);
router.get("/:id/boards", getBoardsByUser);

module.exports = router;
