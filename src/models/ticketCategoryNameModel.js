const mongoose = require('mongoose')

const ticketCategoryNameModel = new mongoose.Schema({
  name: {
    en: { type: String, required: false },
    ru: { type: String, required: false },
    uz: { type: String, required: true },
  }
})

module.exports = mongoose.model('ticketCategoryNames', ticketCategoryNameModel)