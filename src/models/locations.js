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
            id: 'is_empty',
            quoted: true
        },
        {
            id: 'map_id',
            quoted: false
        },
        {
            id: 'hex',
            quoted: true
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

module.exports = LocationHandler;
