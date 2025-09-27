const router = require('express').Router();
const ctrl = require('../controllers/productCtrl');

router.get('/', ctrl.list);
router.post('/', ctrl.create); // (optional: use auth in future)

module.exports = router;