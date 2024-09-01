import express  from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import http from 'http';
import dotenv from 'dotenv';
//const express = require('express');
import { Question,User } from '../models/index.js';
const router = express.Router();

//const { ObjectId } = mongoose.Types;
//const nodemailer = require('nodemailer');
//const { Question, User } = require('../models'); // Import your models
dotenv.config();

console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS ? '********' : 'Not Set');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed certificate errors
  }, 
  logger: true, // Enable debug logging
  debug: true // Enable debug logging
});

//checking
router.get('/', (req, res) => {
  res.send('Hello from the router!');
});
/*router.get('/request-code', (req, res) => {
    // Log request details
  console.log('Received GET request at /request-code');
  res.send('Hello from request-code');
});*/


// Route to send notification request
router.post('/request-code', async (req, res) => {
   // Log request details to verify if the endpoint is hit
   console.log('Received request at /request-code:');
   console.log('Request body:', req.body); // Log request body for debugging
 
  const { questionId, userId } = req.body;

  try {
    //const question = await Question.findById(mongoose.Types.ObjectId(questionId));
    //const user = await User.findById(mongoose.Types.ObjectId(userId));
    const question = await Question.findById(questionId);
    const user = await User.findById(userId);

    // Log the retrieved question and user for debugging
    console.log('Retrieved Question:', question);
    console.log('Retrieved User:', user);

    if (!question || !user) {
      return res.status(404).json({ message: 'Question or user not found' });
    }

    // Debugging email address and other details
    console.log('Poster Email:', question.posterEmail);
    console.log('Poster Name:', question.posterName);
    console.log('Question Title:', question.title);
    console.log('User Name:', user.name);

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to:question.posterEmail,
      subject: 'Code Review Request',
      text: `Hello ${question.posterName},\n\n${user.name} would like to review your code related to the question titled "${question.title}". Please provide the code to facilitate the review.\n\nBest regards,\nYour Team`
    };
     // Log mail options for debugging
     console.log('Mail Options:', mailOptions);


    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//module.exports = router;
export default router;
