// backend/controllers/feedbackCtrl.js

const Feedback = require('../models/Feedback');
// We can reuse our AI helper function from aiCtrl!
const { callGeminiApi } = require('./aiCtrl'); 

exports.create = async (req, res) => {
  try {
    const { name, rating, comments } = req.body;

    if (!name || !rating || !comments) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // AI Sentiment Analysis
    const systemPrompt = `Analyze the sentiment of this user feedback and respond with only one word: Positive, Negative, or Neutral.`;
    const sentiment = await callGeminiApi(systemPrompt, comments);

    const feedback = await Feedback.create({
      name,
      rating,
      comments,
      sentiment: sentiment.trim(), // Save the AI's response
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error("Feedback creation error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};