const mongoose = require('mongoose');

const destSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  googleMaps360Url: String,
  tags: [String],
  coordinates: { lat: Number, lng: Number },
  bestTime: String,
  entryFee: String,
  region: String,
  rating: { type: Number, default: 4.5 }
});

module.exports = mongoose.model('Destination', destSchema);
