const bcrypt = require('bcryptjs');

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const comparePassword = async (encrypted, compare) => {
    console.log(encrypted, compare)
    return bcrypt.compare(encrypted, compare);
};

module.exports = {
    encryptPassword,
    comparePassword,
}