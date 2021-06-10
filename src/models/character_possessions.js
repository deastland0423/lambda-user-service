const ModelBase = require('./ModelBase');

const ormDef = {
    label: 'character_possessions',
    table: 'character_possessions',
    id_field: 'possession_id',
    insert_fields: [
        {
            id: 'character_id',
            quoted: false
        },
        {
            id: 'name',
            quoted: true
        },
        {
            id: 'player_description',
            quoted: true
        },
        {
            id: 'admin_description',
            quoted: true
        },
        {
            id: 'value',
            quoted: false
        },
        {
            id: 'in_inventory',
            quoted: false
        }
    ],
    access: {
      'POST /possessions': (req) => true,
      'GET /possessions': () => true,
      'PUT /possessions/([0-9]+)': (req) => true,
      'DELETE /possessions/([0-9]+)': (req) => true
    }
}

const CharacterPossessionHandler = new ModelBase(ormDef);

module.exports = CharacterPossessionHandler;