const router = require('express').Router();

const controller = require('./auth.controller');
const validation = require('./auth.validation');

const { userAuthMiddleware } = require('../../middlewares/authMiddlewares');
const { validateSchema } = require('../../middlewares/validation');

router.post('/register', validateSchema(validation.register), controller.register);
router.post('/login', validateSchema(validation.login), controller.login);
router.get('/whoAmI', userAuthMiddleware, controller.whoAmI);

module.exports = router;
