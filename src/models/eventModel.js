const mongoose = require("mongoose");

const eventModel = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: false },
      ru: { type: String, required: false },
      uz: { type: String, required: true },
    },
    price: {
      minPrice: { type: Number, required: true},
      maxPrice: { type: Number, required: true},
    },
    location: {
      latitude: { type: String, required: false },
      longitude: { type: String, required: false },
      venueName: {
        en: { type: String, required: false },
        ru: { type: String, required: false },
        uz: { type: String, required: true },
      },
      address: {
        en: { type: String, required: false },
        ru: { type: String, required: false },
        uz: { type: String, required: true },
      },
      phoneNumber: { type: String, required: false },
    },
    events: [
      {
        name: {
          en: { type: String, required: false },
          ru: { type: String, required: false },
          uz: { type: String, required: true },
        },
        venueName: {
          en: { type: String, required: false },
          ru: { type: String, required: false },
          uz: { type: String, required: true },
        },
        date: { type: Date, required: true },
        time: {
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categories",
      required: true,
    },
    hall: {
      type: mongoose.Schema.ObjectId,
      ref: "halls",
      required: false,
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
