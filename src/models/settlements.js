const ModelBase = require('./ModelBase');

const ormDef = {
  label: 'Settlement',
  table: 'settlements',
  id_field: 'settlement_id',
  insert_fields: [
    {
      id: 'name',
      quoted: true
    },
    {
      id: 'hex',
      quoted: true
    },
    {
      id: 'sub_hex',
      quoted: true
    },
    {
      id: 'population',
    },
    {
      id: 'category',
      quoted: true
    },
    {
      id: 'map_id',
    }
  ],
  access: {
    //TODO
  }
}

const SettlementHandler = new ModelBase(ormDef);

module.exports = SettlementHandler;
