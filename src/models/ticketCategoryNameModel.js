const mongoose = require('mongoose')

const ticketCategoryNameModel = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    uz: { type: String, required: true },
  }
})

module.exports = mongoose.model('ticketCategoryNames', ticketCategoryNameModel)