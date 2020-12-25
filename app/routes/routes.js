const router = require('express').Router();
const passport = require('passport');
const userCtrl = require('../controllers/users.controller');
const authCtrl = require('../controllers/auth.controller');
const roomsCtrl = require('../controllers/rooms.controller');

router.post('/user/register', authCtrl.register);
router.post('/user/login', (req, res, next) => passport.authenticate(
    'local-login',
    { session: false },
    authCtrl.login(req, res),
)(req, res, next));

router.get(
    '/auth/whoAmI',
    passport.authenticate('jwt', { session: false }),
    authCtrl.whoAmI,
);

router.get('/search/autocomplete/:q', userCtrl.searchVideoSuggestions);
router.get('/youtube/:q', userCtrl.getVideos);

router.post('/room/create', roomsCtrl.create);
router.get('/room/isValid/:id', roomsCtrl.isValid);

module.exports = router;
