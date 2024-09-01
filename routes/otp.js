// routes/otp.js
import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import cors from 'cors';
//app.use(cors());


dotenv.config();


const router = express.Router();
const users = {}; // In-memory storage for OTPs, replace with database in production
router.get('/send-otp', async (req, res) => {
 console.log('sucessfuly getting the sent-otp endpoint!');
 res.status(200).send('OTP endpoint reached');
})

// Generate OTP and send via email
router.post('/send-otp', async (req, res) => {
    console.log('sucessfuly posting!');
  const { email } = req.body;
console.log ("i got this:",email)
  if (!email) {
    return res.status(400).send('Email is required');
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  users[email] = { otp, timestamp: Date.now() };
    // Log the environment variables to debug if they are correctly loaded
    console.log('Email User in otp file:', process.env.EMAIL_USER);
    console.log('Email Pass in otp file:', process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Bypass certificate validation
      },
    });
    
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    });
    res.status(200).send('OTP sent');
  } catch (error) {
    console.error('Error sending email:', error); // Log the detailed error
    res.status(500).send('Failed to send OTP');
  }
});

// Verify OTP and issue JWT
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send('Email and OTP are required');
  }

  const userOtp = users[email];

  if (!userOtp || userOtp.otp !== otp || Date.now() - userOtp.timestamp > 300000) { // 5 minutes expiration
    return res.status(400).send('Invalid or expired OTP');
  }

  const token = jwt.sign({ email }, process.env._SECRET, { expiresIn: '1h' });
  delete users[email]; // Clear OTP after verification

  res.status(200).json({ token });
});

export default router;
