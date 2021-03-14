const mysql = require('../utils/mysql_utils');
const ModelBase = require('./ModelBase');

const ormDef = {
    label: 'character',
    table: 'characters',
    id_field: 'character_id',
    insert_fields: [
        {
            id: 'name',
            quoted: true
        },
        {
            id: 'class',
            quoted: true
        },
        {
            id: 'level',
            quoted: false
        },
        {
            id: 'gold',
            quoted: false
        },
        {
            id: 'home_base_settlement_id',
            quoted: false
        }
    ]
}

const CharacterHandler = new ModelBase(ormDef);

CharacterHandler.getView = async function() {
    console.log('entering characters.getView');
    const connection = await mysql.connection();
    try {
        const sql = `SELECT c.*, u.username FROM ${ormDef.table} c, users u WHERE c.owner_user_id = u.user_id;`
        console.log(`DEBUG: getView SQL: ${sql}`)
        let recordList = await connection.query(sql);
        return recordList;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = CharacterHandler;
