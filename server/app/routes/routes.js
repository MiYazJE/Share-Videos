const router = require('express').Router();

const authRouter = require('../api/auth/auth.router');
const playListsRouter = require('../api/playlists/playlists.router');
const roomsRouter = require('../api/rooms/rooms.router');
const videosRouter = require('../api/videos/videos.router');

router.use('/auth', authRouter);
router.use('/playlists/', playListsRouter);
router.use('/rooms', roomsRouter);
router.use('/videos', videosRouter);

module.exports = router;
