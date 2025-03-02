// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MONGO_URI is read from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas -> Hotel_booking database');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
