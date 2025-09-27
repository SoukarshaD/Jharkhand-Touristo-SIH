const Event = require('../models/Event');

exports.list = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        console.error('Events list error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.create = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.json(event);
    } catch (err) {
        console.error('Event create error:', err);
        res.status(400).json({ message: 'Invalid payload' });
    }
};
