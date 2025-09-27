// backend/controllers/productCtrl.js

const Product = require('../models/Product');

const list = async (req, res) => {
    try {
        const q = req.query.q || '';
        const filter = q ? { $text: { $search: q } } : {};
        const products = await Product.find(filter)
            // We are adding 'isVerified' to the populate method here
            .populate('sellerId', 'name isVerified') 
            .limit(100);
        res.json(products);
    } catch (err) {
        console.error('Products list error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const create = async (req, res) => {
    try {
        const body = req.body;
        // Add the logged-in user as the seller
        body.sellerId = req.user.id;
        const product = await Product.create(body);
        res.json(product);
    } catch (err) {
        console.error('Product create error:', err);
        res.status(400).json({ message: 'Invalid payload' });
    }
};

module.exports = {
    list,
    create,
};