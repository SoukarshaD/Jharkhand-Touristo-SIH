// backend/controllers/homestayCtrl.js

const Homestay = require('../models/Homestay');

exports.list = async (req, res) => {
    try {
        const homestays = await Homestay.find({});
        res.json(homestays);
    } catch (err) {
        console.error("Homestays list error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getById = async (req, res) => {
    try {
        const homestay = await Homestay.findById(req.params.id);
        if (!homestay) return res.status(404).json({ message: 'Homestay not found.' });
        res.json(homestay);
    } catch (err) {
        console.error("Homestay getById error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.create = async (req, res) => {
    try {
        const homestay = await Homestay.create(req.body);
        res.json(homestay);
    } catch (err) {
        console.error("Homestay create error:", err);
        res.status(400).json({ message: "Invalid payload" });
    }
};