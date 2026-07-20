const router = require('express').Router();

const controller = require('./rooms.controller');

const { userAuthMiddleware } = require('../../middlewares/authMiddlewares');
const asyncHandler = require('../../middlewares/asyncHandler');

router.post('/create', userAuthMiddleware, asyncHandler(controller.create));
router.get('/:id/isValid/', asyncHandler(controller.isValid));

module.exports = router;
