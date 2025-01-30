const mongoose = require("mongoose");

const ticketCategoryModel = new mongoose.Schema({
  ticketCategoryName: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "ticketCategoryNames",
  },
  price: {
    type: Number,
    required: true,
  },
  area: [
    {
      sector: {
        status: { type: String, required: false },
        name: {
          en: { type: String, required: false },
          ru: { type: String, required: false },
          uz: { type: String, required: true },
        },
      },
      status: {
        type: String,
        required: true,
        enum: ["available", "reserved", "sold"],
        default: "available",
      },
      row: { type: String, required: true },
      seat: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("ticketCategories", ticketCategoryModel);
