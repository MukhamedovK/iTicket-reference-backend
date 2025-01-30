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
  hall: { type: mongoose.Types.ObjectId, required: true, ref: "halls" },
  lat: { type: String, required: false },
  lon: { type: String, required: false },
  phoneNumber: { type: String, required: false },
});

module.exports = mongoose.model("areas", areaModel);
