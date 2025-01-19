const mongoose = require('mongoose');

const categoryModel = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    uz: { type: String, required: true },
  }
})

module.exports = mongoose.model('categories', categoryModel);