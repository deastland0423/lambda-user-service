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

async function addUser(data) {
    console.log('addUser data: ', data);

    const connection = await mysql.connection();
    try {
        console.log(`entering addUser`);
        const sql = `INSERT INTO oseitu.users (email_address, password) values ('${data.email_address}', '${data.password}')`;

        // console.log('SQL: ', sql);

        let response = await connection.query(sql);

        return `User ${data.email_address} added to database.`;

    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }

}

async function getUserRoles() {
    const sql = 'SELECT u.email_address, r.role_name FROM oseitu.users u, oseitu.user_roles ur, oseitu.roles r WHERE u.user_id = ur.user_id AND ur.role_id = r.role_id';

    try {
        console.log('ss');
    } catch (err) {
        console.error('dd');
    }
}

module.exports = { getUsers, addUser };