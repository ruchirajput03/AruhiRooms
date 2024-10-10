const express = require("express");
const router = express.Router();

const Room = require('../models/room')

router.get("/getallrooms", async (req, res) => {
    try {
        const rooms = await Room.find({})
        res.send(rooms)
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});
router.post(`/getroombyid/:roomid`, async (req, res) => {
    const { roomid } = req.params;
    try {
        const room = await Room.findById(roomid);
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch room", error });
    }
});
router.post("/addroom", async (req, res) => {
    try {
        const newroom = new Room(req.body)
        await newroom.save()

        res.send('New Room Added Successfully')

    } catch (error) {
        return res.status(400).json({ error });
    }
})

router.delete('/removeroom/:roomid', async (req, res) => {
    try {
      await Room.findByIdAndDelete(req.params.roomid);
      res.send('Room Deleted Successfully');
    } catch (error) {
      return res.status(400).json({ error });
    }
  });
module.exports = router;