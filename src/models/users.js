const mysql = require('../utils/mysql_utils');

const ormDef = {
    label: 'Users',
    table: 'users',
    id_field: 'user_id',
    insert_fields: [
        {
            id: 'email_address',
            quoted: true
        },
        {
            id: 'password',
            quoted: true
        },
        {
            id: 'username',
            quoted: true
        }
    ]
}

function _combineRoles(userList) {
    // join roles together
    let combinedUserList = {};
    userList.forEach((item) => {
      const pojo = Object.fromEntries(Object.entries(item));
      console.log(`adding for key ${item.user_id}`, pojo)
        if (item.user_id in combinedUserList) {
          if (pojo.roles) {
            combinedUserList[item.user_id].roles.push(pojo.roles);
          }
        } else {
          combinedUserList[item.user_id] = pojo;
          if (pojo.roles) {
            combinedUserList[item.user_id].roles = [pojo.roles];
          } else {
            combinedUserList[item.user_id].roles = []
          }
        }
        console.log(`resulting combinedlist`, combinedUserList)
    });
    return Object.values(combinedUserList);
}

async function getUsers() {
    const connection = await mysql.connection();
    try {
        console.log('entering getUsers');
        const userList = await connection.query('SELECT users.user_id, username, email_address, role as roles FROM users LEFT JOIN user_roles ON users.user_id = user_roles.user_id;');
        return _combineRoles(userList);
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function getUser(user_id) {
    const connection = await mysql.connection();
    try {
        console.log(`entering getUser(${user_id})`);
        const userList = await connection.query(`select users.user_id, username, email_address, role as roles FROM users LEFT JOIN user_roles ON users.user_id = user_roles.user_id WHERE users.user_id = ${user_id}`);
        const combinedUserList = _combineRoles(userList);
        return combinedUserList[0];
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function verifyUser(email_address, password) {

    const connection = await mysql.connection();
    try {
        console.log('verifying login for: ', email_address);

        const sql = `SELECT user_id, username, email_address FROM users WHERE email_address = '${email_address}' AND password = '${password}'`;

        let userResult = await connection.query(sql);

        console.log('Result from verifying user: ', userResult);

        return userResult;
    } catch (err) {
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


async function deleteUser(data) {
    console.log('deleteRecord data: ', data);
    const connection = await mysql.connection();
    try {
        const sql = `DELETE FROM ${ormDef.table} WHERE ${ormDef.id_field} = ${data[ormDef.id_field]}`;
        console.log(`deleteRecord SQL: ${sql}`);
        let response = await connection.query(sql);
        if(response.affectedRows) {
            result = 'deleted from database'
        } else {
            result = 'was not found'
        }
        return `${ormDef.table} ${data[ormDef.id_field]} ${result}.`;
    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }
}


async function updateUser(record_id, data) {
    console.log(`updateRecord (${record_id}) data: `, data);
    const connection = await mysql.connection();
    try {
        let fieldUpdates = [];
        ormDef.insert_fields.forEach(field => {
            if (field.id in data) {
                if (field.quoted) {
                    fieldUpdates.push(`${field.id} = '${data[field.id]}'`)
                } else {
                    fieldUpdates.push(`${field.id} = ${data[field.id]}`)
                }
            }
        })
        if (fieldUpdates.length == 0) {
            return 'No data to update.';
        }
        const setSql = fieldUpdates.join(', ')
        const sql = `UPDATE ${ormDef.table} SET ${setSql} WHERE ${ormDef.id_field} = ${record_id}`;
        console.log(`entering updateRecord: sql=${sql}`);
        let response = await connection.query(sql);
        if(response.affectedRows) {
            result = 'was updated'
        } else {
            result = 'had no changes'
        }
        return `${ormDef.table} ${record_id} ${result}.`;
    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }
}
module.exports = { getUsers, getUser, addUser, verifyUser, deleteUser, updateUser };