const { getConnection } = require('../../db/connect');

async function find(column, nameOrEmail) {
    const con = getConnection();
    const [
        user,
    ] = await con.execute(`SELECT * FROM users WHERE \`${column}\` = ?`, [
        nameOrEmail,
    ]);
    return user.length ? { ...user[0] } : null;
}

async function save({ name, password, email }) {
    try {
        const con = getConnection();
        await con.execute('INSERT INTO users VALUES(NULL, ?, ?, ?)', [
            name,
            password,
            email,
        ]);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    find,
    save,
};
