const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy    = require('passport-jwt').Strategy;
const userCtrl = require('../controllers/users.controller');
const { comparePassword } = require('./auth.helpers');
const { getConnection } = require('../../db/connect');

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
    new LocalStrategy(PASSPORT_CONFIG.LOCAL, async (nameOrEmail, password, done) => {
        const con = await getConnection();

        let userExists =
            (await userCtrl.checkIfUserExists(con, 'name', nameOrEmail)) ||
            (await userCtrl.checkIfUserExists(con, 'email', nameOrEmail));

        if (!userExists.length)
            return done(null, null, {
                nameOrEmailError: true,
                msg: `There isn't any user registered with ${nameOrEmail}.`,
            });

        const correctPassword = await comparePassword(password, userExists[0].password);
        if (!correctPassword) return done(null, null, { passwordError: true, msg: "The password isn't correct." });

        return done(null, { ...userExists[0] }, { error: false, msg: 'You have logged in.' });
    })
);

passport.use(
    new JwtStrategy(
        PASSPORT_CONFIG.JWT, 
        async (payload, done) => {
            console.log(payload);
            const con = await getConnection();
            const [user] = await con.execute('SELECT * FROM users WHERE `id` = ?', [payload.id]); 
            done(null, { ...user[0], password: null });
        }
    )
);    
