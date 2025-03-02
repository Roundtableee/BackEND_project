// models/hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('Hotel', hotelSchema, 'hotels');
