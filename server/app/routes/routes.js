const router = require('express').Router();
const userCTRL = require('../controllers/users.controllers');

router.get('/test', userCTRL.test);

router.get('/youtube/search/:q/:maxResults', userCTRL.searchVideoSuggestions);

module.exports = router;