const router = require('express').Router();
const ctrl = require('../controllers/homestayCtrl');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);

module.exports = router;
