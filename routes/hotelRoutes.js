const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Public endpoint - users can view all hotels
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);

// Admin endpoints
router.post('/', authMiddleware, adminMiddleware, hotelController.createHotel);
router.put('/:id', authMiddleware, adminMiddleware, hotelController.updateHotel);
router.delete('/:id', authMiddleware, adminMiddleware, hotelController.deleteHotel);

module.exports = router;
