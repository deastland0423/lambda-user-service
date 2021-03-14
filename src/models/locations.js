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
    ]
}

const LocationHandler = new ModelBase(ormDef);

module.exports = LocationHandler;
