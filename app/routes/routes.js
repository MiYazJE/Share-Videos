const router = require('express').Router();
const userCtrl = require('../controllers/users.controller');
const roomsCtrl = require('../controllers/rooms.controller');

router.post('/user/register', userCtrl.register);
router.post('/user/login',    userCtrl.login);

router.get('/search/autocomplete/:q', userCtrl.searchVideoSuggestions);
router.get('/youtube/:q',             userCtrl.getVideos);

router.post('/room/create',     roomsCtrl.create);
router.get('/room/isValid/:id', roomsCtrl.isValid);

module.exports = router;