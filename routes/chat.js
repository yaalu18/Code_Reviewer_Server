// routes/chat.js
import express from 'express';

const router = express.Router();

// Simple rule-based responses
const responses = {
  "how to sort an array in javascript": "You can use the array.sort() method.",
  "what is a promise in javascript": "A promise is an object representing the eventual completion or failure of an asynchronous operation."
};

router.post('/', (req, res) => {
  const { question } = req.body;
  const answer = responses[question.toLowerCase()] || "Sorry, I don't understand that question.";
  res.status(200).json({ answer });
});

export default router;
