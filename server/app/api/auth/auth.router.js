const router = require('express').Router();
const controller = require('./auth.controller');
const { jwtMiddleware } = require('../../middlewares/authMiddlewares');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/whoAmI', jwtMiddleware, controller.whoAmI);

module.exports = router;
