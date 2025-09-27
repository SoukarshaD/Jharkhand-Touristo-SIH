const router = require('express').Router();
const aiCtrl = require('../controllers/aiCtrl');

router.post('/chat', aiCtrl.getChatResponse);
router.post('/plan', aiCtrl.planItinerary);

module.exports = router;