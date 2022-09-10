const router = require('express').Router();

const controller = require('./rooms.controller');
const validation = require('./rooms.validation');

const { userAuthMiddleware } = require('../../middlewares/authMiddlewares');
const { validateSchema } = require('../../middlewares/validation');

router.post('/create', userAuthMiddleware, validateSchema(validation.create), controller.create);
router.get('/:id/isValid/', userAuthMiddleware, controller.isValid);

module.exports = router;
