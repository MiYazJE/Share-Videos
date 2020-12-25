const bcrypt = require('bcryptjs');

module.exports = {
    encryptPassword,
    comparePassword,
};

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

async function comparePassword(encrypted, compare) {
    console.log(encrypted, compare)
    return bcrypt.compare(encrypted, compare);
};