const mysql = require('../utils/mysql_utils');
const ModelBase = require('./ModelBase');

const ormDef = {
    label: 'Adventure',
    table: 'adventures',
    id_field: 'adventure_id',
    insert_fields: [
        {
            id: 'name',
            quoted: true
        },
        {
            id: 'session_id',
            quoted: false
        },
        {
            id: 'location_id',
            quoted: false
        },
        {
            id: 'character_count',
            quoted: false
        }
    ]
}

const AdventureHandler = new ModelBase(ormDef);

AdventureHandler.getView = async function() {
    console.log('entering adventures.getView');
    const connection = await mysql.connection();
    try {
        const sql = `SELECT a.*, s.start_time, l.name AS location_name FROM ${ormDef.table} a, sessions s, locations l WHERE a.session_id = s.session_id AND a.location_id = l.location_id`
        console.log(`DEBUG: getView SQL: ${sql}`)
        let recordList = await connection.query(sql);
        return recordList;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = AdventureHandler;