const passport = require('passport');

const jwtMiddleware = passport.authenticate('jwt', { session: false });

module.exports = {
  jwtMiddleware,
};
