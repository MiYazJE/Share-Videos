const router = require('express').Router();
const controller = require('./playlists.controller');
const { jwtMiddleware } = require('../../middlewares/authMiddlewares');

router.get('/getAll', jwtMiddleware, controller.getAllUserPlaylists);

module.exports = router;
