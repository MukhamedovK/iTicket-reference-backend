const mongoose = require("mongoose");

const eventModel = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: false },
      ru: { type: String, required: false },
      uz: { type: String, required: true },
    },
    area: { type: mongoose.Types.ObjectId, required: true, ref: "areas" },
    organization: { type: String, required: false },
    date: [
      {
        date: {
          type: Date,
          required: true,
          default: Date.now().toLocaleString(),
        },
        time: {
          start: { type: String, required: true },
          end: { type: String, required: true },
        },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categories",
      required: true,
    },
    is2D: { type: Boolean, required: false, default: false },
    bannerImage: { type: String, required: false },
    cardImage: { type: [String], required: false },
    aboutEvent: {
      en: { type: String, required: false },
      ru: { type: String, required: false },
      uz: { type: String, required: false },
    },
    ageAndLanguage: {
      age: { type: String, required: false },
      language: {
        en: { type: String, required: false },
        ru: { type: String, required: false },
        uz: { type: String, required: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("events", eventModel);
