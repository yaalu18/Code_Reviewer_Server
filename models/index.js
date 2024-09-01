import mongoose from 'mongoose';
//const mongoose = require('mongoose');

// Define the Question schema
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  posterName: { type: String, required: true },
  posterEmail: { type: String, required: true },
  // Add other fields as necessary
});

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  // Add other fields as necessary
});

// Create models from schemas
const Question = mongoose.model('Question', questionSchema);
const User = mongoose.model('User', userSchema);

//module.exports = { Question, User };
export {Question,User};
