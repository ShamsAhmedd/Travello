//register AND login
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");

router.post("/Register", asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json("This user already registered")
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)

        // Create a new user with name, email, and password
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })

        // Save the user to the database
        const Result = await user.save();

        // Generate token for the user
        const token = user.generateToken();

        // Send response with user data and token
        const { password, ...other } = Result._doc;
        return res.status(200).json({ ...other, token })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));

router.post("/Login", asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    //check if user in db
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json("this user not found ")
    }
    // check is password true
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordMatch) {
        return res.status(400).json("invaild password ")
    }

    const token = user.generateToken();
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token })
}))


router.post("/loginAdmin", asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user is in the database
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json("User not found");
    }

    // Check if the password is correct
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json("Invalid password");
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
        return res.status(403).json("Access denied. Admins only.");
    }

    const token = user.generateToken();
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
}));

module.exports = router;