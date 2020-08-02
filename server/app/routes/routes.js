const router = require('express').Router();
const userCTRL = require('../controllers/users.controllers');

router.get('/search/autocomplete/:q', userCTRL.searchVideoSuggestions);

module.exports = router;