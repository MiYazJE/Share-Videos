const jwt = require('jsonwebtoken');
const passport = require('passport');

const Playlist = require('../../models/playlists.model');
const { encryptPassword } = require('../../lib/auth.helpers');
const User = require('../../models/users.model');
const usersBll = require('../users/users.bll');
const generateAvatar = require('../../helpers/generateAvatar');

const OPTS_COOKIE = {
  expires: new Date(Date.now() + 3600000 * 24 * 7),
  secure: true,
  httpOnly: true,
};

const DEFAULT_PLAYLIST_TITLE = 'Default Playlist';

function createToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
    expiresIn: '7d',
  });
}

function successLogin(req, res) {
  return (err, user) => {
    if (err || !user) {
      return res.status(401).json({ msg: 'Password or nickname are incorrects' });
    }
    const token = `Bearer ${createToken({ id: user._id })}`;
    return res.json({ user: usersBll.mapUser(user), token });
  };
}

function login(req, res) {
  return passport.authenticate('local-login', {}, successLogin(req, res))(req, res);
}

const register = async (req, res) => {
  const { name, password } = req.body;

  const userExists = await User.exists({ name });
  if (userExists) {
    return res.json({
      error: true,
      msg: 'That nickname already exists. Please, choose another.',
    });
  }

  const avatarBase64 = generateAvatar(name);
  const encryptedPassword = await encryptPassword(password);

  const user = new User({
    name,
    avatarBase64,
    password: encryptedPassword,
  });

  const playlist = new Playlist({
    title: DEFAULT_PLAYLIST_TITLE,
    user: user._doc._id,
  });

  await Promise.all([
    user.save(),
    playlist.save(),
  ]);

  return res.json({ error: false, msg: 'You have been registered.' });
};

function whoAmI(req, res) {
  const { user } = req;
  return res.json({ auth: true, user: usersBll.mapUser(user) });
}

module.exports = {
  login,
  register,
  whoAmI,
};
