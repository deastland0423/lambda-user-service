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
    ],
    access: {
      'POST /characters': (req) => (['PLAYER','DM','ADMIN'].some(role => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes(role))),
      'GET /characters': (req) => true,
      'PUT /character/([0-9]+)': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),  // Only Admins can update for now
      'DELETE /character/([0-9]+)': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN')
    }
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
