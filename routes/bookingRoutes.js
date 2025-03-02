// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes -> require authMiddleware
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getAllBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.put('/:bookingId', authMiddleware, bookingController.updateBooking);
router.delete('/:bookingId', authMiddleware, bookingController.deleteBooking);

module.exports = router;
