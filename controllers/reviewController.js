const Review = require('../models/review');
const Hotel = require('../models/hotel');

const reviewController = {
  createReview: async (req, res) => {
    try {
      const { hotelId, rating, comment } = req.body;
      const userId = req.user._id;

      const review = new Review({
        userId,
        hotelId,
        rating,
        comment
      });

      await review.save();

      // Update hotel's average rating and total reviews
      const hotel = await Hotel.findById(hotelId);
      const reviews = await Review.find({ hotelId });
      
      const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
      
      hotel.averageRating = averageRating;
      hotel.totalReviews = reviews.length;
      await hotel.save();

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getHotelReviews: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const reviews = await Review.find({ hotelId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user._id;

      const review = await Review.findOneAndUpdate(
        { _id: reviewId, userId },
        { rating, comment },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
      }

      // Update hotel's average rating
      const hotel = await Hotel.findById(review.hotelId);
      const reviews = await Review.find({ hotelId: review.hotelId });
      hotel.averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
      await hotel.save();

      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user._id;

      const review = await Review.findOneAndDelete({ _id: reviewId, userId });

      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
      }

      // Update hotel's average rating and total reviews
      const hotel = await Hotel.findById(review.hotelId);
      const reviews = await Review.find({ hotelId: review.hotelId });
      
      hotel.averageRating = reviews.length ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
      hotel.totalReviews = reviews.length;
      await hotel.save();

      res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = reviewController;
