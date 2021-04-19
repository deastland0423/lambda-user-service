const mysql = require('../utils/mysql_utils');
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
  ],
  access: {
    'POST /sessions': (req) => (['DM','ADMIN'].some(role => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes(role))),
    'GET /sessions': (req) => true,
    'PUT /session/([0-9]+)': (req) => (
      req.locals.safeGetProp(req, ['locals', 'currentUser', 'user_id'], []) == req.locals.routeParams[0]  // Only same user
      || req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN')  // Admins can update sessions
    ),
    'DELETE /session/([0-9]+)': (req) => (req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'))
  }
}

const SessionHandler = new ModelBase(ormDef);

SessionHandler.getView = async function(params) {
  console.log(`entering sessions.getView, params=`,params);
  const connection = await mysql.connection();
  try {
    const whereClause = SessionHandler.getWhere(params);
    const sql = `SELECT s.*, u.user_id, u.username, u.email_address FROM ${ormDef.table} s LEFT JOIN users u ON s.host_user_id = u.user_id ${whereClause}`
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
