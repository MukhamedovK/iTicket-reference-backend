const mongoose = require("mongoose");

const areaModel = new mongoose.Schema({
  country: {
    en: { type: String, required: false },
    ru: { type: String, required: false },
    uz: { type: String, required: true },
  },
  city: {
    en: { type: String, required: false },
    ru: { type: String, required: false },
    uz: { type: String, required: true },
  },
  area: {
    en: { type: String, required: false },
    ru: { type: String, required: false },
    uz: { type: String, required: true },
  },
  hallName: {
    en: { type: String, required: false },
    ru: { type: String, required: false },
    uz: { type: String, required: true },
  },
  lat: { type: String, required: false },
  lon: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  ticketCategory: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Seat",
    },
  ],
});

module.exports = mongoose.model("areas", areaModel);
