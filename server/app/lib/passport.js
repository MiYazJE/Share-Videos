const passport = require('passport');
const config = require('../../config/config');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/users.model');
const { comparePassword } = require('./auth.helpers');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const PASSPORT_CONFIG = {
  LOCAL: {
    usernameField: 'name',
    passwordField: 'password',
  },
  JWT: {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: config.accessSecretToken,
  },
};

passport.use(
  'local-login',
  new LocalStrategy(PASSPORT_CONFIG.LOCAL, async (name, password, done) => {
    const user = (await User.findOne({ name }));

    if (!user) {
      return done(null, null, {
        error: true,
        msg: `User ${name} not exists.`,
      });
    }

    const correctPassword = await comparePassword(password, user.password);
    if (!correctPassword) {
      return done(null, null, {
        error: true,
        passwordError: true,
        msg: "The password isn't correct.",
      });
    }

    return done(null, { ...user._doc }, { error: false, msg: 'You have logged in.' });
  }),
);

passport.use(
  new JwtStrategy(PASSPORT_CONFIG.JWT, async (payload, done) => {
    const user = await User.findOne({ _id: payload.id });
    const parsedUser = user._doc;
    done(null, {
      id: parsedUser._id,
      name: parsedUser.name,
    });
  }),
);
