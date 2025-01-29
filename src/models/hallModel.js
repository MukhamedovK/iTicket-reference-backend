const mongoose = require("mongoose");

const hallModel = new mongoose.Schema({
  area: { type: String, required: true },
  hallName: { type: String, required: true },
  ticketCategory: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "ticketCategory",
  },
});

module.exports = mongoose.model("halls", hallModel);
