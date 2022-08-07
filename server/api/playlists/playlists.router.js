const router = require('express').Router();
const controller = require('./playlists.controller');
const { jwtMiddleware } = require('../../app/middlewares/authMiddlewares');

router.get('/getAll', jwtMiddleware, controller.getAllUserPlaylists);

module.exports = router;
