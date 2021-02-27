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
        const sql = `INSERT INTO oseitu.users (email_address, username, password) values ('${data.email_address}', '${data.username}', '${data.password}')`;
        console.log(`addUser SQL: ${sql}`);
        let response = await connection.query(sql);
        return `User ${data.email_address} added to database.`;
    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }
}

async function getUserRoles() {
    const sql = 'SELECT u.username, ur.role FROM users u, user_roles ur WHERE u.user_id = ur.user_id;';
    try {
        let response = await connection.query(sql);
        console.log('ss');
    } catch (err) {
        console.error('dd');
    }
}

module.exports = { getUsers, addUser };