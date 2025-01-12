const mongoose = require("mongoose");

const eventModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      latitude: { type: String, required: false },
      longitude: { type: String, required: false },
      venueName: { type: String, required: true },
      address: { type: String, required: false },
      phoneNumber: { type: String, required: false },
    },
    events: [
      {
        name: {
          type: String,
          required: false,
          default: function () {
            return `${this.name.toUpperCase()} (${this.ageAndLanguage.age})`;
          },
        },
        venueName: {
          type: String,
          required: false,
          default: function () {
            return this.location.venueName;
          },
        },
        date: { type: Date, required: true },
        time: {
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      },
    ],
    seats: [
      {
        area: { type: String, required: true },
        sector: {type: String, required: true},
        seatNumber: { type: [Number], required: true },
        rowNumber: { type: [Number], required: true },
        price: { type: Number, required: true },
        availability: { type: Boolean, required: true, default: true },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: true,
    },
    is2D: { type: Boolean, required: false, default: false },
    bannerImage: { type: String, required: true },
    cardImage: { type: String, required: true },
    aboutEvent: {
      type: String,
      required: false,
    },
    ageAndLanguage: {
      age: { type: String, required: false },
      language: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("events", eventModel);
