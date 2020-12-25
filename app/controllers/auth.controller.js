const jwt = require('jsonwebtoken');
const { encryptPassword } = require('../lib/auth.helpers');
const { getConnection } = require('../../db/connect');

const OPTS_COOKIE = {
    expires: new Date(Date.now() + 3600000 * 24 * 7),
    secure: process.env.ENVIROMENT === 'production',
    httpOnly: true,
};

module.exports = {
    login,
    register,
    whoAmI,
};

function login(req, res) {
    return (err, user, info) => {
        if (err || !user) {
            return res.json({ info });
        }
        const token = createToken({ id: user.id });
        res.cookie('jwt', token, OPTS_COOKIE);
        res.json({ info, user: { name: user.name } });
    };
}

function createToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '7d',
    });
}

async function register(req, res) {
    const { name, password, email } = req.body;
    const connection = await getConnection();

    const [emailAlreadyRegistered] = await connection.execute('SELECT * from users where `email` = ?', [email]);
    if (emailAlreadyRegistered.length) {
        return res.json({ error: true, msg: 'Same email already registered.' });
    }

    const [nameAlreadyRegistered] = await connection.execute('SELECT * from users where `name` = ?', [name]);
    if (nameAlreadyRegistered.length) {
        return res.json({ error: true, msg: 'That name has been taken.' });
    }

    const encryptedPassword = await encryptPassword(password);
    await connection.execute('INSERT INTO users VALUES(NULL, ?, ?, ?)', [name, encryptedPassword, email]);

    res.json({ error: false, msg: 'You have been registered.' });
}

function whoAmI(req, res) {
    const { user } = req;
    if (!user) return res.status(401).json({ auth: false });
    res.cookie('jwt', req.cookies.jwt, OPTS_COOKIE);
    res.json({ auth: true, user });
}
