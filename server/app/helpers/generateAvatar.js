const { createAvatar } = require('@dicebear/avatars');
const style = require('@dicebear/avatars-bottts-sprites');

function generateAvatar(seed) {
  return createAvatar(style, {
    seed,
    base64: true,
  });
}

module.exports = generateAvatar;
