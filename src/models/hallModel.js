const mongoose = require("mongoose");

const hallModel = new mongoose.Schema({
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
  ticketCategory: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ticketCategories",
    },
  ],
});

module.exports = mongoose.model("halls", hallModel);
