const router = require('express').Router();
const ctrl = require('../controllers/analyticsCtrl');

router.get('/summary', ctrl.summary);

module.exports = router;