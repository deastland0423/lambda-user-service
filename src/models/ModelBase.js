const mysql = require('../utils/mysql_utils');

class ModelBase {
  constructor(ormDef) {
    this.ormDef = ormDef;
  }

  getWhere(params, table_alias, existing_where) {
    if(typeof table_alias === 'undefined') table_alias = this.ormDef.table;
    let conditions = [];
    let values = []
    this.ormDef.insert_fields.forEach(field => {
      if (!Object.keys(params).includes(field.id)) {
        return;
      }
      let value;
      if (field.quoted) {
        value = `'${params[field.id]}'`;
      } else {
        value = `${Number(params[field.id])}`;
      }
      conditions.push(`${table_alias}.${field.id} = ${value}`);
    })
    if (conditions.length) {
      if (existing_where)
        return 'AND '+conditions.join(' AND ');
      else
        return 'WHERE '+conditions.join(' AND ');
    } else {
      return '';
    }
  }

  getAccess() {
    return this.ormDef.access;
  }

  async getRecords(params) {
    console.log('entering getRecords');
    const connection = await mysql.connection();
    try {
      const whereClause = this.getWhere(params);
      const sql = `SELECT * FROM ${this.ormDef.table} ${whereClause}`
      console.log(`DEBUG: getRecords SQL: ${sql}`)
      let recordList = await connection.query(sql);
      return recordList;
    } catch(err) {
      throw err;
    } finally {
      await connection.release();
    }
  }


  async addRecord(data) {
    console.log('addRecord data: ', data);
    const connection = await mysql.connection();
    try {
      let columns = []
      let values = []
      this.ormDef.insert_fields.forEach(field => {
        columns.push(field.id)
        if (field.quoted) {
          values.push(`'${data[field.id]}'`)
        } else {
          values.push(`${Number(data[field.id])}`)
        }
      })
      const sql = `INSERT INTO ${this.ormDef.table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
      console.log(`DEBUG: addRecord SQL: ${sql}`)
      let response = await connection.query(sql);
      return `${this.ormDef.table} ${data.name} added to database.`;
    } catch (err) {
      throw err
    } finally {
      await connection.release();
    }
  }


  async deleteRecord(data) {
    console.log('deleteRecord data: ', data);
    const connection = await mysql.connection();
    try {
      const sql = `DELETE FROM ${this.ormDef.table} WHERE ${this.ormDef.id_field} = ${data[this.ormDef.id_field]}`;
      console.log(`deleteRecord SQL: ${sql}`);
      let response = await connection.query(sql);
      let result = null;
      if(response.affectedRows) {
        result = 'deleted from database'
      } else {
        result = 'was not found'
      }
      return `${this.ormDef.table} ${data[this.ormDef.id_field]} ${result}.`;
    } catch (err) {
      throw err
    } finally {
      await connection.release();
    }
  }


  async updateRecord(record_id, data) {
    console.log(`updateRecord (${record_id}) data: `, data);
    const connection = await mysql.connection();
    try {
      let fieldUpdates = [];
      this.ormDef.insert_fields.forEach(field => {
        if (field.id in data) {
          if (field.quoted) {
            fieldUpdates.push(`${field.id} = '${data[field.id]}'`)
          } else {
            fieldUpdates.push(`${field.id} = ${data[field.id]}`)
          }
        }
      })
      if (fieldUpdates.length == 0) {
        return 'No data to update.';
      }
      const setSql = fieldUpdates.join(', ')
      const sql = `UPDATE ${this.ormDef.table} SET ${setSql} WHERE ${this.ormDef.id_field} = ${record_id}`;
      console.log(`entering updateRecord: sql=${sql}`);
      let response = await connection.query(sql);
      let result = null;
      if(response.affectedRows) {
        result = 'was updated'
      } else {
        result = 'had no changes'
      }
      return `${this.ormDef.table} ${record_id} ${result}.`;
    } catch (err) {
      throw err
    } finally {
      await connection.release();
    }
  }
};

module.exports = ModelBase;
