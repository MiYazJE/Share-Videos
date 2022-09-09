const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../../config/config');

const users = require('../models/users.model');

const jwtMiddleware = passport.authenticate('jwt', { session: false });

async function userAuthMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !token.includes('Bearer')) {
    return res.status(401).json({ msg: 'No token provided.' });
  }

  const parsedToken = token.split` `[1];
  try {
    const isValid = jwt.verify(parsedToken, config.accessSecretToken);
    if (!isValid) {
      return res.status(401).json({ msg: 'Invalid token.' });
    }
    req.user = await users.findById(isValid.id);
    return next();
  } catch (e) {
    return res.status(401).json({ msg: 'Expired token.' });
  }
}

module.exports = {
  jwtMiddleware,
  userAuthMiddleware,
};
