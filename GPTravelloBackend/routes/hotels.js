const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Hotel, validateCreateHotel, validateUpdateHotel } = require("../models/hotels");
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

// Create a hotel 
router.post("/hotels", upload.single("image"), asyncHandler(async (req, res) => {
    try {
      const { error } = validateCreateHotel(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }
  
      // Create Hotel object
      const hotel = new Hotel({
        location: req.body.location,
        price: req.body.price,
        roomType: req.body.roomType,
        
        image: req.file.filename, // Use the filename saved by multer
      });
  
      // Save hotel to database
      const result = await hotel.save();
  
      res.status(200).json(result);
    } catch (error) {
      // Handle any internal server errors
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));


// Get all hotels
router.get("/hotels", asyncHandler(async (req, res) => {
        const hotelList = await Hotel.find();
        res.json(hotelList);
    
}));

// Get a hotel by ID
router.get("/hotels/:id", asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
        res.status(200).json(hotel)
    }
    else {
        res.status(404).json("hotel not found")
    }
   
}));

// Update a hotel
router.put("/hotels/:id", upload.single("image"), asyncHandler(async (req, res) => {
  try {
      const { error } = validateUpdateHotel(req.body);
      if (error) {
          return res.status(400).json({ error: error.details[0].message });
      }

      const updateFields = {};

      if (req.body.location) updateFields.location = req.body.location;
      if (req.body.price) updateFields.price = req.body.price;
      if (req.body.roomType) updateFields.roomType = req.body.roomType;
      if (req.file) updateFields.image = req.file.filename;

      const hotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });

      if (!hotel) {
          return res.status(404).json({ error: "Hotel not found" });
      }

      res.status(200).json(hotel);
  } catch (error) {
      // Handle any internal server errors
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
}));
// Delete a hotel
router.delete("/hotels/:id", asyncHandler(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
        await hotel.deleteOne(); // Corrected line
        res.status(200).json("hotel deleted");
    } else {
        res.status(400).json("hotel Not deleted");
    }
}));


module.exports = router;
