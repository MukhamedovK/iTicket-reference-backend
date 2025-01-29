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
        status: { type: String, required: true },
        name: { type: String, required: true },
      },
      status: {
        type: String,
        required: true,
        enum: ["available", "reserved", "sold"],
      },
      row: { type: String, required: true },
      seat: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("ticketCategories", ticketCategoryModel);
