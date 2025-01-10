const mongoose = require('mongoose');
const Joi = require("joi");

const BookingSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String, // Change to String type
        required: true,
        ref: "users"
    },
    destination: {
        type: String, // Change to String type
        required: true,
        ref: "trips"
    },
    hotel: {
        type: String, // Change to String type
        required: true,
        ref: "hotels"
    },
});


function validateCreateBooking(obj) {
    const schema = Joi.object({
        userName: Joi.string().min(3).required(),
        email: Joi.string().email().required(), 
        destination: Joi.string().required(),
        hotel: Joi.string().required(),
    });
    return schema.validate(obj);
}

function validateUpdateBooking(obj) {
    const schema = Joi.object({
        userName: Joi.string().min(3),
        email: Joi.string(),
        destination: Joi.string(),
        hotel: Joi.string(),
    });
    return schema.validate(obj);
}
const Booking = mongoose.model('Tickets', BookingSchema);

module.exports = { Booking, validateCreateBooking,validateUpdateBooking };
