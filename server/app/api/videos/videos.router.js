const router = require('express').Router();
const videosCtrl = require('./videos.controller');

router.get('/autocomplete/youtube/:q', videosCtrl.autocompleteYoutube);
router.get('/youtube/:q', videosCtrl.getYoutubeVideos);

module.exports = router;
