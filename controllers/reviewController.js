const Review = require('../models/review');
const Hotel = require('../models/hotel');
const User = require('../models/user');

// 1. Create a review
exports.createReview = async (req, res) => {
  try {
    const { hotelId, rating, comment } = req.body;
    const userId = req.user.userId;

    // Check if the hotel exists
    const foundHotel = await Hotel.findById(hotelId);
    if (!foundHotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    // Create a new review
    const newReview = new Review({
      userId,
      hotelId,
      rating,
      comment
    });
    await newReview.save();

    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Get all reviews for a hotel
exports.getAllReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Log the hotelId for debugging
    console.log(`Fetching reviews for hotelId: ${hotelId}`);

    // Retrieve reviews for the hotel
    const reviews = await Review.find({ hotelId }).populate('userId', 'name');

    // Log the retrieved reviews for debugging
    console.log(`Retrieved reviews: ${JSON.stringify(reviews)}`);

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review by ID
    const review = await Review.findById(id).populate('userId', 'name');
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Find the review by ID
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Ensure that only the review owner can update it
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this review.' });
    }

    // Update relevant fields
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    res.json({ message: 'Review updated', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review by ID
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Ensure that only the review owner can delete it
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review.' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};