const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../../config/config');

const users = require('../models/users.model');

const jwtMiddleware = passport.authenticate('jwt', { session: false });

async function userAuthMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided.' });
  }

  const parsedToken = token.slice('Bearer '.length).trim();
  if (!parsedToken) {
    return res.status(401).json({ msg: 'No token provided.' });
  }

  try {
    const payload = jwt.verify(parsedToken, config.accessSecretToken);
    const user = await users.findById(payload.id);
    if (!user) {
      return res.status(401).json({ msg: 'Invalid token.' });
    }

    req.user = user;
    return next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid or expired token.' });
  }
}

module.exports = {
  jwtMiddleware,
  userAuthMiddleware,
};
