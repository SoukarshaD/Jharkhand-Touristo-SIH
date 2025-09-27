const Review = require('../models/Reviews');
const { callGeminiApi } = require('./aiCtrl'); // We'll need to export this from aiCtrl

exports.create = async (req, res) => {
  try {
    const { spotId, userName, comment, rating } = req.body;

    // AI Sentiment Analysis
    const systemPrompt = `Analyze the sentiment of this review and respond with only one word: Positive, Negative, or Neutral.`;
    const sentiment = await callGeminiApi(systemPrompt, comment);

    const review = await Review.create({
      spotId,
      userName,
      comment,
      rating,
      sentiment: sentiment.trim(), // Save the AI's response
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};