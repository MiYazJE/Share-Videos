const router = require('express').Router();
const userCtrl = require('../controllers/users.controller');
const roomsCtrl = require('../controllers/rooms.controller');

router.get('/search/autocomplete/:q', userCtrl.searchVideoSuggestions);
router.get('/youtube/:q',             userCtrl.getVideos);

router.post('/room/create',     roomsCtrl.create);
router.get('/room/isValid/:id', roomsCtrl.isValid);

module.exports = router;