// models/booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkIn:  Date,
  checkOut: Date
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
