import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notifications.js';
import nodemailer from 'nodemailer';
import http from 'http';


import { Question,User } from './models/index.js';
import otpRoutes from './routes/otp.js';
import chatRoutes from './routes/chat.js';



//const express = require('express');
//const mongoose = require('mongoose');
//const dotenv = require('dotenv');
//const notificationRoutes = require('./routes/notifications');

dotenv.config();
 
const app = express();
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'  // Replace with your client URL
}));
app.use(express.json());
app.use('/api/chat', chatRoutes);
app.use('/api/otp', otpRoutes);
//checking
//router.get('/', (req, res) => {
  //  res.send('Hello from the router!');
  //});
app.get('/', (req, res) => {
  res.send('Hello from the root!');
})
  

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
/*const seedData = async () => {
  // Sample user
  const user = new User({
    //_id: mongoose.Types.ObjectId('64d0f5083f1f1d2d8d3a2c0b'), // Replace with a valid ObjectId
    _id: '64d0f5083f1f1d2d8d3a2c0b', 
    name: 'yaalu',
    email: 'yaalu18@gmail.com'
  });

  // Sample question
  const question = new Question({
    //_id: mongoose.Types.ObjectId('64d0f5083f1f1d2d8d3a2c0c'), // Replace with a valid ObjectId
    _id: '64d0f5083f1f1d2d8d3a2c0c',
    title: 'How to fix this bug?',
    posterName: 'shreya',
    posterEmail: 'shreya@gmail.com'
  });
    // Sample user
    const user = new User({
      //_id: mongoose.Types.ObjectId('64d0f5083f1f1d2d8d3a2c0b'), // Replace with a valid ObjectId
      _id: '60d5f488d8a0b7a7f7b8e2b2', 
      name: 'yaalu',
      email: 'yaalu18@gmail.com'
    });
  
    // Sample question
    const question = new Question({
      //_id: mongoose.Types.ObjectId('64d0f5083f1f1d2d8d3a2c0c'), // Replace with a valid ObjectId
      _id:  '60d5f488d8a0b7a7f7b8e2b1',
      title: 'How to fix this bug?',
      posterName: 'yaalu',
      posterEmail: 'yaalu18@gmail.com'
    });

  try {
    await user.save();
    await question.save();
    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedData();*/

// Use notification routes
app.use('/api/notifications', notificationRoutes);
app.get('/test-email', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
     tls: {
      rejectUnauthorized: false
  }
  });
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'yaalu.181999@gmail.com', // Replace with a valid recipient email
      subject: 'Test Email',
      text: 'This is a test email.'
    });
    res.status(200).send('Test email sent');
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).send('Failed to send test email');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//const http = require("http");
//const nodemailer = require("nodemailer");

const server = http.createServer((request, response) => {
    const auth = nodemailer.createTransport({
        service: "gmail",
        secure : true,
       
        auth: {
            //user: "youremail@gmail.com",
            //pass: "your_password"
            user: "yaalu18@gmail.com",
            pass: "rhribdxswoxbwruc"
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const receiver = {
        from : "yaalu18@gmail.com",
        to : "yaalu.181999@gmail.com",
        subject : "Node Js Mail Testing!",
        text : "Hello this is a text mail!"
    };

    auth.sendMail(receiver, (error, emailResponse) => {
        if(error)
        throw error;
        console.log("success!");
        response.end();
    });
    
});

//server.listen(8080);
const EMAIL_SERVER_PORT = 8080;
server.listen(EMAIL_SERVER_PORT, () => {
  console.log(`Email server is running on port ${EMAIL_SERVER_PORT}`);
});
/*git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/yaalu18/Code_Reviewer_Server.git
git push -u origin main*/