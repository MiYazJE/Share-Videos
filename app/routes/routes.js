const router = require('express').Router();
const userCtrl = require('../controllers/users.controller');
const roomsCtrl = require('../controllers/rooms.controller');

router.get('/search/autocomplete/:q', userCtrl.searchVideoSuggestions);
router.get('/youtube/:q',             userCtrl.getVideos);

router.get('/room/create',            roomsCtrl.create);

module.exports = router;