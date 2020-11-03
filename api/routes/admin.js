const express = require("express");
const {
  createNewSection,
  getAllSections,
  getAllUsers,
  getSection,
  removeUser,
  dropUserCollection,
  registerAdmin,
  loginAdmin,
  registerTags,
  getAllBoards,
  getAllMediaCards,
  getAllActionCards,
  removeSection,
  updateSection,
} = require("../controllers/admin");

const router = express.Router();

router.post("/create-new-section", createNewSection);
router.get("/get-all-sections", getAllSections);
router.delete("/remove-section", removeSection);
router.put("/update-section", updateSection);
router.get("/:sectionID/section", getSection);
router.get("/allusers", getAllUsers);
router.get("/allboards", getAllBoards);
router.get("/allmediacards", getAllMediaCards);
router.get("/allactioncards", getAllActionCards);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/register-tags", registerTags);
router.delete("/remove-user", removeUser);
router.delete("/drop-collection", dropUserCollection);

module.exports = router;
