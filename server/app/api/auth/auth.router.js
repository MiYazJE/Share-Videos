const router = require('express').Router();
const controller = require('./auth.controller');
const { userAuthMiddleware } = require('../../middlewares/authMiddlewares');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/whoAmI', userAuthMiddleware, controller.whoAmI);

module.exports = router;
