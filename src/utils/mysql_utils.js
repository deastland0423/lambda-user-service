// This is an attempt to create a mysql access library that supports async/await.
const mysql = require('mysql');

let dbConfig = {
    host: 'campaign-test-3.cjojv7gsvzpz.us-east-1.rds.amazonaws.com',
    user: 'oseitu',
    password: 'oseitu',
    database: 'oseitu'
};

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

module.exports = { pool, connection, query };