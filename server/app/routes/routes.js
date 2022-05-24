const router = require('express').Router();
const userCtrl = require('../controllers/users.controller');
const authCtrl = require('../controllers/auth.controller');
const roomsCtrl = require('../controllers/rooms.controller');
const playlistsCtrl = require('../controllers/playlists.controller');
const { jwtMiddleware } = require('../middlewares/authMiddlewares');

router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/logout', authCtrl.logout);
router.get('/auth/whoAmI', jwtMiddleware, authCtrl.whoAmI);

router.get('/playlists/getAll/', jwtMiddleware, playlistsCtrl.getAllUserPlaylists);

router.get('/search/autocomplete/:q', userCtrl.searchVideoSuggestions);
router.get('/youtube/:q', userCtrl.getVideos);

router.post('/room/create', roomsCtrl.create);
router.get('/room/isValid/:id', roomsCtrl.isValid);

module.exports = router;
