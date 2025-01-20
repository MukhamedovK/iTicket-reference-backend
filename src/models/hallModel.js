const mongoose = require("mongoose");

const hallModel = new mongoose.Schema({
  hallName: {
    en: { type: String, required: false },
    ru: { type: String, required: false },
    uz: { type: String, required: true },
  },
  seats: [
    {
      sector: {
        en: { type: String, required: false },
        ru: { type: String, required: false },
        uz: { type: String, required: true },
      },
      ticketType: { type: String, required: true },
      seatNumber: { type: Number, required: true },
      rowNumber: { type: Number, required: true },
      availability: {
        type: String,
        required: true,
        enum: ["available", "reserved", "sold"],
      },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("halls", hallModel);
