const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const TokenModel = require("../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs")

const { User } = require("../models/User");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

// POST /api/forget-password endpoint
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;

  // Generate a unique token or reset link
  const token = crypto.randomBytes(20).toString("hex");

  try {
    // Store token and email in the database
    await TokenModel.create({ email, token });

    // Send the reset link to the provided email address
    await sendResetEmail(email, token);

    res.status(200).json({ message: "Reset link sent successfully." });
  } catch (error) {
    console.error("Error occurred while resetting password:", error);
    res.status(500).json({ message: "Failed to send reset link." });
  }
});

// POST /api/reset-password endpoint
router.post("/reset-password", async (req, res) => {
  const { email, newPassword, token } = req.body;
  try {
    // Verify token and reset password
    const tokenDocument = await TokenModel.findOne({ email, token });
    if (!tokenDocument) {
      res.status(400).json({ message: "Invalid token or email." });
      return;
    }

    // Update the password for the user with the provided email
    const saltRounds = 10; // You can adjust this value as needed
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the new password with the salt
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password for the user with the provided email
    await User.findOneAndUpdate({ email }, { password: hashedPassword, salt });

    // Password reset successful, delete the token document from the database
    await TokenModel.deleteOne({ email, token });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error occurred while resetting password:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

// Function to send the reset email
async function sendResetEmail(email, token) {
  try {
    // Create a nodemailer transporter with your email service provider details
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "travellOo24@gmail.com",
        pass: "gehwlvhlrpakkkba",
      },
      debug: true, // Add this line
    });

    // Compose the email
    const mailOptions = {
      from: "travellOo24@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `<p>Click the following link to reset your password:</p>
             <a href="http://localhost:3000/ResetPassword/${token}">Reset Password</a>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

module.exports = router;