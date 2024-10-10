const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const stripe = require('stripe')('sk_test_51PcuTkAdrA8AK8Xx9FYdYg4mhYn95blwUKbKbt6cFjVNRqrjxVH343sSQJ9UgqXHdsEvk3o7RWh3WllQDm1TJH6C00GIzKpYyf');

router.post('/bookroom', async (req, res) => {
  const {
    room,
    roomid,
    userid,
    fromDate,
    toDate,
    totalAmount,
    totalDays,
    token,
  } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create({
      amount: totalAmount * 100, // Stripe amount is in cents
      customer: customer.id,
      currency: 'INR',
      receipt_email: token.email,
    }, {
      idempotencyKey: uuidv4(),
    });

    if (payment) {
      const transactionId = uuidv4();

      const newBooking = new Booking({
        room: room.name,
        roomid: roomid,
        userid,
        fromDate: moment(fromDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        toDate: moment(toDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        totalAmount,
        totalDays,
        transactionId,
        status: 'Success',
      });

      const booking = await newBooking.save();
      const roomtemp = await Room.findById(roomid);

      roomtemp.currentBooking.push({
        bookingid: booking._id,
        fromDate: moment(fromDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        toDate: moment(toDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();

      res.json({
        success:true,
        message: 'Payment Successful, Your room is booked',
        booking,
        transactionId: newBooking.transactionId,
      });
    }
  } catch (error) {
    console.error('Error booking room or processing payment:', error);
    res.status(400).json({
      success:false,
      message: error.message ,
    });
  }
});

router.post("/getbookingsbyuserid", async(req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(400).json({ error: 'Error fetching bookings' });
  }
});

router.post('/cancel', async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const booking = await Booking.findById(bookingid);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.currentBooking = room.currentBooking.filter(
      (currentBooking) => currentBooking.bookingid.toString() !== bookingid
    );
    await room.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({ error: 'Error cancelling booking' });
  }
});

router.get("/getallbookings",async(req,res)=>{
try{
const bookings=await Booking.find()
res.send(bookings)
}catch(error){
return res.status(400).json({error});
}
})


module.exports = router;
