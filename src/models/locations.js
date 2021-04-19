const mysql = require('../utils/mysql_utils');
const ModelBase = require('./ModelBase');

const ormDef = {
  label: 'Location',
  table: 'locations',
  id_field: 'location_id',
  insert_fields: [
    {
      id: 'name',
      quoted: true
    },
    {
      id: 'map_id',
    },
    {
      id: 'hex_id',
    },
    {
      id: 'sub_hex',
      quoted: true
    }
  ],
  access: {
    'POST /locations': (req) => (['DM','ADMIN'].some(role => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes(role))),
    'GET /locations': (req) => true,
    'PUT /location/([0-9]+)': (req) => (req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN')),
    'DELETE /location/([0-9]+)': (req) => (req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'))
  }
}

const LocationHandler = new ModelBase(ormDef);

LocationHandler.getView = async function(params) {
  console.log(`entering locations.getView, params=`,params);
  const connection = await mysql.connection();
  try {
    const whereClause = LocationHandler.getWhere(params);
    const sql = `SELECT l.*, h.name AS hex_name, h.coords AS hex_coords FROM ${ormDef.table} l LEFT JOIN hexes h ON l.hex_id = h.hex_id ${whereClause}`
    console.log(`DEBUG: getView SQL: ${sql}`)
    let recordList = await connection.query(sql);
    return recordList;
  } catch(err) {
    throw err;
  } finally {
    await connection.release();
  }
}

module.exports = LocationHandler;
