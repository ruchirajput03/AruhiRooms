// booking.js (model file)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  roomid: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  fromDate: {
    type: String,
    required: true
  },
  toDate: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    default: uuidv4
  },
  status: {
    type: String,
    required: true,
    default: 'Success'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
