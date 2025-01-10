const mongoose = require('mongoose');
const Joi = require("joi");

const hotelSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        required: true,
        enum:["single","double"]
    },
    image: {
        type: String,
    }
});

function validateCreateHotel(obj) {
    const schema = Joi.object({
        location: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(), // Adjusted minimum price
        roomType: Joi.string().valid("single", "double"),
        image: Joi.string() // Adjusted image validation
    });
    return schema.validate(obj);
}

function validateUpdateHotel(obj) {
    const schema = Joi.object({
        location: Joi.string().min(3),
        price: Joi.number().min(0), // Adjusted minimum price
        roomType: Joi.string().valid("single", "double"),
        image: Joi.string() // Adjusted image validation
    });
    return schema.validate(obj);
}

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = { Hotel, validateCreateHotel, validateUpdateHotel };
