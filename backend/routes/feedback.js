// backend/routes/feedback.js

const router = require('express').Router();
const feedbackCtrl = require('../controllers/feedbackCtrl');

// This endpoint is open to everyone, so no 'auth' middleware is needed.
router.post('/', feedbackCtrl.create);

module.exports = router;