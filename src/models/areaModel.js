const mongoose = require("mongoose");

const areaModel = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  hall: { type: mongoose.Types.ObjectId, required: true, ref: "halls" },
  lat: { type: String, required: true },
  lon: { type: String, required: true },
  phoneNumber: { type: String, required: false },
});

module.exports = mongoose.model("areas", areaModel);
