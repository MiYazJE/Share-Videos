const router = require('express').Router();

const controller = require('./rooms.controller');
const validation = require('./rooms.validation');

const { validateSchema } = require('../../middlewares/validation');
const asyncHandler = require('../../middlewares/asyncHandler');

router.post('/create', validateSchema(validation.create), asyncHandler(controller.create));
router.get('/:id/isValid/', asyncHandler(controller.isValid));

module.exports = router;
