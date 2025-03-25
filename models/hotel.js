// models/hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  district:  String,
  province: String,
  postalcode: String,
  dailyrate: Number,
  phone: String,
  picture: String,
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('Hotel', hotelSchema, 'hotels');