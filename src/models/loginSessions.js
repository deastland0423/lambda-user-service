const uuid = require('uuid');
const mysql = require('../utils/mysql_utils');
const LOGIN_SESSION_EXPIRATION_SEC = 86400;

async function getLoginSession(session_id) {
    const connection = await mysql.connection();
    try {
        console.log(`entering getLoginSession(${session_id})`);
        // get row from login_sessions table by GUID from cookie
        let loginSessions = await connection.query(`SELECT user_id, expires_at FROM login_sessions WHERE login_session_uuid = '${session_id}'`);
        // No active session
        if (loginSessions.length === 0) {
            return false;
        }
  		  // check expires_at time
        const now = Math.floor(Date.now() / 1000);
        if (loginSessions[0].expires_at < now) {
            // Session has expired, delete this record.
            deleteLoginSession(session_id);
            return false;
        } else {
            // Current session, update session expiration time.
            const new_expiration = now + LOGIN_SESSION_EXPIRATION_SEC;
            await connection.query(`UPDATE login_sessions SET expires_at = ${new_expiration} WHERE login_session_uuid = '${session_id}'`);
        }
        return loginSessions[0];
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}


async function createLoginSession(user_id) {
    console.log(`createLoginSession(${user_id})`);
    const connection = await mysql.connection();
    try {
        const new_expiration = Math.floor(Date.now() / 1000) + LOGIN_SESSION_EXPIRATION_SEC;
        const session_uuid = uuid();
        const sql = `INSERT INTO login_sessions (login_session_uuid, user_id, expires_at) values ('${session_uuid}', '${user_id}', '${new_expiration}')`;
        console.log(`createLoginSession SQL: ${sql}`);
        let response = await connection.query(sql);
        return {login_session_uuid: session_uuid, max_age: LOGIN_SESSION_EXPIRATION_SEC};
    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }
}


async function deleteLoginSession(login_session_id) {
    console.log(`entering deleteLoginSession(${session_id})`);
    const connection = await mysql.connection();
    try {
        const sql = `DELETE FROM login_sessions WHERE login_session_id = '${login_session_id}'`;
        console.log(`deleteLoginSession SQL: ${sql}`);
        let response = await connection.query(sql);
        console.log(`affectedRows: ${response.affectedRows}`)
        return true;
    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }
}


module.exports = { createLoginSession, getLoginSession, deleteLoginSession, LOGIN_SESSION_EXPIRATION_SEC };
