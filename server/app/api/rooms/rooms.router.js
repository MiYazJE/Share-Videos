const router = require('express').Router();
const controller = require('./rooms.controller');

router.post('/create', controller.create);
router.get('/:id/isValid/', controller.isValid);

module.exports = router;
