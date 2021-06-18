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
    },
    {
      id: 'gold',
    },
    {
      id: 'home_base_settlement_id',
    },
    {
      id: 'owner_user_id',
    }
  ],
  access: {
    'POST /characters': (req) => (['PLAYER','DM','ADMIN'].some(role => (req?.locals?.currentUser?.roles ?? []).includes(role))),
    'GET /characters': (req) => true,
    'PUT /character/([0-9]+)': (req) =>
      ( (req?.locals?.currentUser?.roles ?? []).includes('ADMIN') // Admins can edit any char
        || (req?.locals?.currentUser?.user_id && req?.locals?.currentUser?.user_id == req?.locals?.row?.owner_user_id)
      ) // Or the owner can edit their own char
    ,
    'DELETE /character/([0-9]+)': (req) => (req?.locals?.currentUser?.roles ?? []).includes('ADMIN')
  }
}

const CharacterHandler = new ModelBase(ormDef);

CharacterHandler.getView = async function(params) {
  console.log('entering characters.getView, params=',params);
  const connection = await mysql.connection();
  try {
    const whereClause = CharacterHandler.getWhere(params, 'c', true);
    const sql = `SELECT c.*, u.username FROM ${ormDef.table} c, users u WHERE c.owner_user_id = u.user_id ${whereClause}`
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
