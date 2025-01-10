const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Trip, validateCreateTrip, validateUpdateTrip } = require("../models/Trip");
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images"));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
});

// Multer upload configuration
const upload = multer({ storage });

// Create a trip 
router.post("/trips", upload.single("image"), asyncHandler(async (req, res) => {
    try {
      const { error } = validateCreateTrip(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }
  
      // Create trip object
      const trip = new Trip({
        destination: req.body.destination,
        price: req.body.price,
        description: req.body.description,
        startDate: req.body.startDate,
        image: req.file.filename, // Use the filename saved by multer
      });
  
      // Save trip to database
      const result = await trip.save();
  
      res.status(200).json(result);
    } catch (error) {
      // Handle any internal server errors
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));


// Get all trips
router.get("/trips", asyncHandler(async (req, res) => {
        const tripList = await Trip.find();
        res.json(tripList);
    
}));

// Get a trip by ID
router.get("/trips/:id", asyncHandler(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    if (trip) {
        res.status(200).json(trip)
    }
    else {
        res.status(404).json("trip not found")
    }
   
}));

// Update a trip
router.put("/trips/:id", upload.single("image"), asyncHandler(async (req, res) => {
  const { error } = validateUpdateTrip(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const updateFields = {};
  if (req.body.destination) updateFields.destination = req.body.destination;
  if (req.body.price) updateFields.price = req.body.price;
  if (req.body.description) updateFields.description = req.body.description;
  if (req.body.startDate) updateFields.startDate = req.body.startDate;
  if (req.file) updateFields.image = req.file.filename;

  if (!Object.keys(updateFields).length) {
    return res.status(400).json({ error: "No valid fields provided for update" });
  }

  // Backend Update
  const trip = await Trip.findByIdAndUpdate(req.params.id, {
    $set: updateFields
  }, { new: true });

  res.status(200).json(trip);
}));
// Delete a trip
router.delete("/trips/:id", asyncHandler(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    if (trip) {
        await Trip.findByIdAndDelete(req.params.id);
        res.status(200).json("trip deleted");
    }
    else {
        res.status(400).json("trip Not deleted");
    }

    
}));


module.exports = router;
