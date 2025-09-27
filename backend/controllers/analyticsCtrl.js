const Destination = require('../models/Destination');
const Product = require('../models/Product');
const Event = require('../models/Event');
const Homestay = require('../models/Homestay');
const Booking = require('../models/Booking');
const Review = require('../models/Reviews');

exports.summary = async (req, res) => {
    try {
        const totalDestinations = await Destination.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalHomestays = await Homestay.countDocuments();
        const totalBookings = await Booking.countDocuments();

        const topDestinationTags = await Destination.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { tag: '$_id', count: 1, _id: 0 } }
        ]);

        // --- REAL SENTIMENT DATA ---
        // This pipeline counts the occurrences of each sentiment type
        const sentimentCounts = await Review.aggregate([
            { $group: { _id: '$sentiment', count: { $sum: 1 } } }
        ]);

        // Format the data for the frontend chart
        const sentiment_analysis = {
            Positive: 0,
            Negative: 0,
            Neutral: 0
        };
        sentimentCounts.forEach(item => {
            if (sentiment_analysis.hasOwnProperty(item._id)) {
                sentiment_analysis[item._id] = item.count;
            }
        });

        res.json({
            totals: {
                destinations: totalDestinations,
                products: totalProducts,
                events: totalEvents,
                homestays: totalHomestays,
                bookings: totalBookings
            },
            topDestinationTags,
            sentiment_analysis, // Send the real data
            generatedAt: new Date(),
        });
    } catch (err) {
        console.error('Analytics summary error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};