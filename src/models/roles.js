const mysql = require('../utils/mysql_utils');

async function getRoles() {
    const connection = await mysql.connection();

    try {
        console.log('entering getRoles');

        let userList = await connection.query('select role from oseitu.user_roles');

        return userList;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = { getRoles };