const mongoose = require('mongoose');
const Joi = require("joi");

const tripSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
    }
});

function validateCreateTrip(obj) {
    const schema = Joi.object({
        destination: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(), // Adjusted minimum price
        description: Joi.string().min(5).required(),
        startDate: Joi.date().iso().required(), // Ensuring ISO date format
        image: Joi.string() // Adjusted image validation
    });
    return schema.validate(obj);
}

function validateUpdateTrip(obj) {
    const schema = Joi.object({
        destination: Joi.string().min(3),
        price: Joi.number().min(0), // Adjusted minimum price
        description: Joi.string().min(5),
        startDate: Joi.date().iso(), // Ensuring ISO date format
        image: Joi.string() // Adjusted image validation
    });
    return schema.validate(obj);
}

const Trip = mongoose.model('Trip', tripSchema);

module.exports = { Trip, validateCreateTrip, validateUpdateTrip };
