const router = require('express').Router();

const controller = require('./playlists.controller');

const { jwtMiddleware } = require('../../middlewares/authMiddlewares');
const asyncHandler = require('../../middlewares/asyncHandler');

router.get('/getAll', jwtMiddleware, asyncHandler(controller.getAllUserPlaylists));

module.exports = router;
