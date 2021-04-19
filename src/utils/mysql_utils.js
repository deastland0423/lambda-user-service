// This is an attempt to create a mysql access library that supports async/await.
const mysql = require('mysql');

const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
const dbConfig = secrets.database;
const db_name = dbConfig.database;

const pool = mysql.createPool(dbConfig);

const connection = () => {
  return new Promise( (resolve, reject) => {
    pool.getConnection( (err, connection) => {
      if (err) reject(err);

      console.log("MySQL pool connected: threadId " + connection.threadId);

      const query = (sql, binding) => {
        return new Promise( (resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });
      };

      const release = () => {
        return new Promise( (resolve, reject) => {
          if (err) reject(err);
          console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };

      resolve( { query, release });
    });
  });
};

const query = (sql, binding) => {
  return new Promise( (resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = { pool, connection, query, db_name };
