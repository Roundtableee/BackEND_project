const mongoose = require('mongoose');
const Review = require('../models/review');
const Hotel = require('../models/hotel');
const User = require('../models/user');

/**
 * Helper function: Calculate the average rating and total reviews for a hotel
 * and update the hotel document accordingly.
 */
async function updateHotelRating(hotelId) {
  try {
    const stats = await Review.aggregate([
      { $match: { hotelId: new mongoose.Types.ObjectId(hotelId) } },
      {
        $group: {
          _id: "$hotelId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    console.log("Aggregation stats:", stats);
    if (stats.length > 0) {
      await Hotel.findByIdAndUpdate(hotelId, {
        averageRating: stats[0].avgRating,
        totalReviews: stats[0].totalReviews
      });
    } else {
      await Hotel.findByIdAndUpdate(hotelId, {
        averageRating: 0,
        totalReviews: 0
      });
    }
  } catch (error) {
    console.error("Error updating hotel rating:", error);
  }
}


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

    // Update the hotel's average rating and total reviews
    await updateHotelRating(hotelId);

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
    console.log(`Fetching reviews for hotelId: ${hotelId}`);

    // Retrieve reviews for the hotel and populate user name
    const reviews = await Review.find({ hotelId }).populate('userId', 'name');
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

    // Find the review by ID and populate the user's name
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

    // Update fields if provided
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Update the hotel's average rating and total reviews after the review update
    await updateHotelRating(review.hotelId);

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

    // Update the hotel's review statistics after deletion
    await updateHotelRating(review.hotelId);

    res.json({ message: 'Review deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
