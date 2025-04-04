const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
require('dotenv').config({ path: './config/config.env' });

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.use('/hotels', hotelRoutes);
app.use('/reviews', reviewRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});