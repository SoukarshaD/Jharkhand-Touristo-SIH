const Destination = require('../models/Destination');

exports.list = async (req, res) => {
  try {
    const q = req.query.q || '';
    let filter = {};
    if (q) {
      filter = { $text: { $search: q } };
    }
    const spots = await Destination.find(filter).select('name description image images tags coordinates').limit(100);
    return res.json(Array.isArray(spots) ? spots : []);
  } catch (err) {
    console.error('Destinations list error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const spot = await Destination.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Not found' });
    return res.json(spot);
  } catch (err) {
    console.error('Destination getById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const body = req.body || {};
    const spot = await Destination.create(body);
    return res.json(spot);
  } catch (err) {
    console.error('Destination create error:', err);
    return res.status(400).json({ message: 'Invalid payload' });
  }
};
