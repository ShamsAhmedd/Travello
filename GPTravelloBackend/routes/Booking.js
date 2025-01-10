const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Booking, validateCreateBooking, validateUpdateBooking } = require("../models/Booking");

router.get("/booking", asyncHandler(async (req, res) => {
    const bookingList = await Booking.find();
    res.json(bookingList);
}));
router.get("/booking/:id", asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
        res.status(200).json(booking)
    }
    else {
        res.status(404).json("book not found")
    }
}));

router.post("/booking", asyncHandler(async (req, res) => {
    const { error } = validateCreateBooking(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }

    const booking = new Booking({
        userName: req.body.userName,
        email: req.body.email,
        destination: req.body.destination,
        hotel: req.body.hotel,
    });
    const result = await booking.save();
    res.status(201).json(result);
}));

router.put("/booking/:id", asyncHandler(async (req, res) => {
    const { error } = validateUpdateBooking(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, {
        $set: {
            userName: req.body.userName,
            email: req.body.email,
            destination: req.body.destination,
            hotel: req.body.hotel,
        }
    }, { new: true });

    res.status(200).json(booking);
}));

router.delete("/booking/:id", asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json("Booking deleted");
    } else {
        res.status(400).json("Booking not found");
    }
}));

module.exports = router;
