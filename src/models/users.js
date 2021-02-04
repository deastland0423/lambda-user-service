const mysql = require('../utils/mysql_utils');

async function getUsers() {
    const connection = await mysql.connection();

    try {
        console.log('entering getUsers');

        let userList = await connection.query('select * from oseitu.users');

        return userList;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = { getUsers };