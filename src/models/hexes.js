const mysql = require('../utils/mysql_utils');
const ModelBase = require('./ModelBase');

const ormDef = {
  label: 'Hex',
  table: 'hexes',
  plural: 'hexes',
  id_field: 'hex_id',
  insert_fields: [
    {
      id: 'name',
      quoted: true
    },
    {
      id: 'map_id',
    },
    {
      id: 'coords',
      quoted: true
    },
    {
      id: 'is_explored',
    },
    {
      id: 'is_polite',
    },
    {
      id: 'terrain_type',
      quoted: true
    }
  ],
  access: {
    // Only Admins can create, update, and delete.
    'POST /hexes': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),
    'GET /hexes': (req) => true,
    'PUT /hex/([0-9]+)': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN'),
    'DELETE /hex/([0-9]+)': (req) => req.locals.safeGetProp(req, ['locals', 'currentUser', 'roles'], []).includes('ADMIN')
  }
}

const HexHandler = new ModelBase(ormDef);

module.exports = HexHandler;