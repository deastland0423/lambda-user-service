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
    },
    {
      id: 'location_id',
    },
    {
      id: 'character_count',
    }
  ],
  access: {
    'POST /adventures': (req) => (['PLAYER','DM','ADMIN'].some(role => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes(role))),
    'GET /adventures': (req) => true,
    'PUT /adventure/([0-9]+)': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),  // Only Admins can update
    'DELETE /adventure/([0-9]+)': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN')
  }
}

const AdventureHandler = new ModelBase(ormDef);

AdventureHandler.getView = async function(params) {
  console.log('entering adventures.getView, params=',params);
  const connection = await mysql.connection();
  try {
    const whereClause = AdventureHandler.getWhere(params, 'a', true);
    const sql = `SELECT a.*, s.start_time, l.name AS location_name FROM ${ormDef.table} a, sessions s, locations l WHERE a.session_id = s.session_id AND a.location_id = l.location_id ${whereClause}`
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
