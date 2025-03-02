
const Hotel = require('../models/hotel');
const Booking = require('../models/booking');
const User = require('../models/user');
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut } = req.body;
    const userId = req.user.userId;

    if (!hotelId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid hotel ID format' });
    }
    // 1. Check if the hotel exists
    const foundHotel = await Hotel.findById(hotelId);
    if (!foundHotel) {
      return res.status(404).json({ message: 'Hotel not found. Cannot create booking.' });
    }

    // 2. Enforce 3-night rule (optional date checks)
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nightDiff = (end - start) / (1000 * 3600 * 24);
    if (nightDiff > 3) {
      return res.status(400).json({ message: 'Cannot book more than 3 nights.' });
    }

    // 3. Create booking
    const booking = new Booking({ 
      userId, 
      hotelId, 
      checkIn, 
      checkOut 
    });
    await booking.save();

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // If user is admin, retrieve all
    if (req.user.role === 'admin') {
      const bookings = await Booking.find().populate('userId', 'email name');
      return res.json(bookings);
    }

    // Else, get only the user's bookings
    const bookings = await Booking.find({ userId: req.user.userId })
                                  .populate('userId', 'email name');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// ✅ Get Booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params; // Extract booking ID from URL

    // 1️⃣ Check if the booking ID is valid (Prevents invalid MongoDB ObjectId errors)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }

    // 2️⃣ Find the booking by ID
    const booking = await Booking.findById(id).populate('hotelId', 'name address phone');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 3️⃣ Ensure that only the booking owner (or admin) can access it
    if (req.user.role !== 'admin' && req.user.userId !== booking.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to view this booking' });
    }

    // ✅ Return the booking details
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { checkIn, checkOut } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // If not admin, ensure ownership
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Validate new 3-night rule if both dates are provided
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const nightDiff = (outDate - inDate) / (1000 * 3600 * 24);
      if (nightDiff > 3) {
        return res.status(400).json({ message: 'Cannot book more than 3 nights.' });
      }
    }

    // Update relevant fields
    if (checkIn !== undefined) booking.checkIn = checkIn;
    if (checkOut !== undefined) booking.checkOut = checkOut;
    await booking.save();

    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // If not admin, ensure ownership
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
