
const Booking = require('../models/booking');
const Hotel = require('../models/hotel');
// 1. Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Get a single hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }
    res.json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Create hotel (admin only)
exports.createHotel = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const newHotel = new Hotel({ name, address, phone });
    await newHotel.save();

    res.status(201).json({ message: 'Hotel created', hotel: newHotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Update hotel (admin only)
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    // Update fields
    if (name !== undefined) hotel.name = name;
    if (address !== undefined) hotel.address = address;
    if (phone !== undefined) hotel.phone = phone;

    await hotel.save();
    res.json({ message: 'Hotel updated', hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Delete hotel (admin only), also delete associated bookings
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    // Delete the hotel
    await hotel.deleteOne();

    // Remove all bookings referencing this hotel
    await Booking.deleteMany({ hotelId: id });

    res.json({ message: 'Hotel and associated bookings deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
