// backend/routes/bookings.js

const router = require('express').Router();
const ctrl = require('../controllers/bookingCtrl');
const auth = require('../middleware/auth'); // Import the auth middleware

// Apply the auth middleware to all routes in this file
// This ensures that only logged-in users can access them
router.use(auth);

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);

module.exports = router;