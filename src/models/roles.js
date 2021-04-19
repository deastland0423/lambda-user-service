const mysql = require('../utils/mysql_utils');

async function getRoles() {
  const connection = await mysql.connection();
  try {
    console.log('entering getRoles method');
    const sql = `SELECT SUBSTRING(COLUMN_TYPE,5) AS enumDef FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${mysql.db_name}' AND TABLE_NAME = 'user_roles' AND COLUMN_NAME = 'role'`
    const row = await connection.query(sql);
    const enumArrayStr = row[0].enumDef.replace(/\(/g, '[').replace(/\)/g,']').replace(/'/g,'"')
    const enumArray = JSON.parse(enumArrayStr)
    return enumArray;
  } catch(err) {
    throw err;
  } finally {
    await connection.release();
  }
}

async function hasRole(user_id, role_name) {
  const connection = await mysql.connection();
  try {
    const sql = `SELECT COUNT(*) AS has_role FROM user_roles WHERE user_id = ${user_id} AND role = '${role_name}'`
    const response = await connection.query(sql);
    return response[0].has_role;
  } catch(err) {
    throw err;
  } finally {
    await connection.release();
  }
}

async function removeRole(user_id, role_name) {
  const connection = await mysql.connection();
  try {
    console.log(`entering removeRole(${user_id}, ${role_name})`);
    const sql = `DELETE FROM user_roles WHERE user_id = ${user_id} AND role = '${role_name}'`
    const response = await connection.query(sql);
    return response.affectedRows;
  } catch(err) {
    throw err;
  } finally {
    await connection.release();
  }
}

async function addRole(user_id, role_name) {
  const connection = await mysql.connection();
  try {
    console.log(`entering addRole(${user_id}, ${role_name})`);
    const sql = `INSERT INTO user_roles (user_id, role) VALUES(${user_id}, '${role_name}')`
    const response = await connection.query(sql);
    return response.affectedRows;
  } catch(err) {
    throw err;
  } finally {
    await connection.release();
  }
}


/**
 * Return true if user roles were changed.
 */
async function ensureRole(user_id, role_name, should_have_role) {
  let changed = false;
  const has_role = await hasRole(user_id, role_name);
  if (has_role && !should_have_role) {
    changed = await removeRole(user_id, role_name);
  } else if (!has_role && should_have_role) {
    changed = await addRole(user_id, role_name);
  }
  return changed;
}

module.exports = { getRoles, ensureRole };
