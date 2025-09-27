// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['tourist', 'vendor', 'admin'], default: 'tourist' },
  location: String,
  isVerified: { type: Boolean, default: false }, // This is the new field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);