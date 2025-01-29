const mongoose = require("mongoose");

const calendarModel = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  address: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("calendars", calendarModel);