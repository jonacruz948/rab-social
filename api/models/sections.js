const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema(
  {
    boards: [],
    cards: [],
    tags: [],
    sectionTitle: String,
  },
  { timestamps: true }
);

const Section = mongoose.model("sections", sectionSchema);

module.exports = Section;
