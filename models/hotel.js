// models/hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String
});

module.exports = mongoose.model('Hotel', hotelSchema,'hotels');
