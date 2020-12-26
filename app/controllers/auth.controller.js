const jwt = require('jsonwebtoken');
const { encryptPassword } = require('../lib/auth.helpers');
const usersModel = require('../models/users.model');

const OPTS_COOKIE = {
    expires: new Date(Date.now() + 3600000 * 24 * 7),
    secure: process.env.ENVIROMENT === 'production',
    httpOnly: true,
};

function createToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '7d',
    });
}

function login(req, res) {
    return (err, user, info) => {
        if (err || !user) {
            return res.json({ info });
        }
        const token = createToken({ id: user.id });
        res.cookie('jwt', token, OPTS_COOKIE);
        return res.json({ info, user: { name: user.name } });
    };
}

async function register(req, res) {
    const { name, password, email } = req.body;

    let userExists = await usersModel.find('email', email);
    if (userExists) {
        return res.json({
            error: true,
            emailError: true,
            msg: 'That email has been registered. Please, choose another.',
        });
    }

    userExists = await usersModel.find('name', name);
    if (userExists) {
        return res.json({
            error: true,
            nameError: true,
            msg: 'That name has been registered. Please, choose another.',
        });
    }

    if (
        await usersModel.save({
            name,
            password: await encryptPassword(password),
            email,
        })
    ) {
        return res.json({ error: false, msg: 'You have been registered.' });
    }

    return res.json({
        error: true,
        msg: 'Unknown problems creating the user.',
    });
}

function whoAmI(req, res) {
    const { user } = req;
    if (!user) return res.status(401).json({ auth: false });
    res.cookie('jwt', req.cookies.jwt, OPTS_COOKIE);
    return res.json({ auth: true, user });
}

function logout(req, res) {
    req.session.destroy();
    res.clearCookie('jwt');
    res.json({ logOut: true });
}

module.exports = {
    login,
    register,
    whoAmI,
    logout,
};
