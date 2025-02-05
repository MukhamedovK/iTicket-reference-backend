const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  map_type: {
    // example: Alisher Navoi nomidagi muzey
    type: String,
    required: true,
  },
  seat_type: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  seat: {
    type: Number,
    required: true,
  },
  sector: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["free", "reserved", "occupied"],
    default: "free",
  },
  booking_time: {
    type: Date,
  },
  expiration_time: {
    type: Date,
  },
});

module.exports = mongoose.model("Seat", SeatSchema);
