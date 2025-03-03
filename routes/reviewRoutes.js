const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public endpoint - users can view all reviews
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);

// Protected endpoints - require authMiddleware
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;