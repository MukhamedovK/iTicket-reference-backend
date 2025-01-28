const mongoose = require('mongoose');

const bannerModel = new mongoose.Schema({
  image: { type: String, required: true },
  link: { type: String, required: true },
})

module.exports = mongoose.model('banners', bannerModel);