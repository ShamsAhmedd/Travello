const express = require("express");
const router = express.Router();

const nodemailer = require('nodemailer');

// Set up the Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'travellOo24@gmail.com', // This will be replaced with the sender's email dynamically
        pass: 'gehwlvhlrpakkkba'
    }
});

router.post('/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: email, // Set the sender's email dynamically
        to: 'travellOo24@gmail.com', // you can set this to your preferred recipient email
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: error.toString() });
        }
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});


module.exports=router
