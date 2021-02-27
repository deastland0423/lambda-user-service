const mysql = require('../utils/mysql_utils');

async function getRoles() {
    const connection = await mysql.connection();
    try {
        console.log('entering getRoles');
        const sql = `SELECT SUBSTRING(COLUMN_TYPE,5) AS enumDef FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${mysql.db_name}' AND TABLE_NAME = 'user_roles' AND COLUMN_NAME = 'role'`
        const row = await connection.query(sql);
        console.log("row",row)
        console.log("row.enumDef",row[0].enumDef)
        const enumArrayStr = row[0].enumDef.replace(/\(/g, '[').replace(/\)/g,']').replace(/'/g,'"')
        console.log("enumArrayStr",enumArrayStr)
        const enumArray = JSON.parse(enumArrayStr)
        console.log("enumArray",enumArray)
        return enumArray;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = { getRoles };