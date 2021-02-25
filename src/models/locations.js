const mysql = require('../utils/mysql_utils');

async function getLocations() {
    const connection = await mysql.connection();

    try {
        console.log('entering getLocations');

        let locationList = await connection.query('select * from oseitu.locations');

        return locationList;
    } catch(err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function addLocation(data) {
    console.log('addLocation data: ', data);

    const connection = await mysql.connection();
    try {
        console.log(`entering addLocation`);
        const sql = `INSERT INTO oseitu.locations (name) values ('${data.name}')`;

        let response = await connection.query(sql);

        return `Location ${data.name} added to database.`;

    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }

}

module.exports = { getLocations, addLocation };