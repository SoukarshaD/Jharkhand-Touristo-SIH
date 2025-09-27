// backend/routes/admin.js

const router = require('express').Router();
const ctrl = require('../controllers/adminCtrl');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Import the new admin middleware

// The login route is for the main admin user, we can leave it for now
// router.post('/login', ctrl.login); 

// --- User Management Routes ---
// These routes are protected and can only be accessed by logged-in admins.
// The middleware runs in order: first 'auth' checks for a valid token, then 'admin' checks the user's role.
router.get('/users', [auth, admin], ctrl.listUsers);
router.patch('/users/:id/verify', [auth, admin], ctrl.verifyUser);

module.exports = router;