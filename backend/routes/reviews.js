const router = require('express').Router();
const reviewCtrl = require('../controllers/reviewCtrl');

router.post('/', reviewCtrl.create);

module.exports = router;