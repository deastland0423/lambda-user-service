const mysql = require('../utils/mysql_utils');

async function getDbQueryResponse(sql) {
  const connection = await mysql.connection();

  try {
    console.log('entering getUsers');
    let userList = await connection.query(sql);
    return userList;
  } catch(err) {
    throw err;
  } finally {
    await connection.release();
  }
}
