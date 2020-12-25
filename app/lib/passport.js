const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const usersModel = require('../models/users.model');
const { comparePassword } = require('./auth.helpers');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const PASSPORT_CONFIG = {
    LOCAL: {
        usernameField: 'nameOrEmail',
        passwordField: 'password',
    },
    JWT: {
        jwtFromRequest: (req) => req.cookies.jwt,
        secretOrKey: process.env.ACCESS_SECRET_TOKEN,
    },
};

passport.use(
    'local-login',
    new LocalStrategy(
        PASSPORT_CONFIG.LOCAL,
        async (nameOrEmail, password, done) => {
            const user = (await usersModel.find('name', nameOrEmail))
                || (await usersModel.find('email', nameOrEmail));

            if (!user) {
                return done(null, null, {
                    nameOrEmailError: true,
                    msg: `There isn't any user registered with ${nameOrEmail}.`,
                });
            }

            const correctPassword = await comparePassword(
                password,
                user.password,
            );
            if (!correctPassword) {
                return done(null, null, {
                    passwordError: true,
                    msg: "The password isn't correct.",
                });
            }

            return done(
                null,
                { ...user },
                { error: false, msg: 'You have logged in.' },
            );
        },
    ),
);

passport.use(
    new JwtStrategy(PASSPORT_CONFIG.JWT, async (payload, done) => {
        const user = await usersModel.find('id', payload.id);
        done(null, { ...user, password: null });
    }),
);
