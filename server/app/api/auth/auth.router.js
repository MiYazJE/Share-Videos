const router = require('express').Router();

const controller = require('./auth.controller');
const validation = require('./auth.validation');

const { userAuthMiddleware } = require('../../middlewares/authMiddlewares');
const { validateSchema } = require('../../middlewares/validation');
const asyncHandler = require('../../middlewares/asyncHandler');

router.post('/register', validateSchema(validation.register), asyncHandler(controller.register));
router.post('/login', validateSchema(validation.login), controller.login);
router.get('/whoAmI', userAuthMiddleware, controller.whoAmI);

module.exports = router;
