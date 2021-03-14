const ModelBase = require('./ModelBase');

const ormDef = {
    label: 'Game Session',
    table: 'sessions',
    id_field: 'session_id',
    insert_fields: [
        {
            id: 'host_user_id',
        },
        {
            id: 'start_time',
            quoted: true
        },
        {
            id: 'duration',
        },
        {
            id: 'max_characters',
        },
        {
            id: 'reserved',
        }
    ]
}

const SessionHandler = new ModelBase(ormDef);

SessionHandler.getView = async function() {
    console.log('entering sessions.getView');
    const connection = await mysql.connection();
    try {
        const sql = `SELECT s.*, u.user_id, u.username, u.email_address FROM ${ormDef.table} s LEFT JOIN users u ON s.host_user_id = u.user_id`
        console.log(`DEBUG: getView SQL: ${sql}`)
        let recordList = await connection.query(sql);
        return recordList;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = SessionHandler;
