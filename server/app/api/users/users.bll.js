const users = require('../../models/users.model');

function mapUser(user) {
  return {
    id: user._id,
    name: user.name,
    avatarBase64: user.avatarBase64,
    color: user.color,
  };
}

async function getUserByName(name) {
  const user = await users.findOne({ name });
  if (!user) return null;
  return mapUser(user);
}

module.exports = {
  getUserByName,
  mapUser,
};
