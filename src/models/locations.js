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

async function deleteLocation(data) {
    console.log('deleteLocation data: ', data);
    const connection = await mysql.connection();
    try {
        const sql = `DELETE FROM oseitu.locations WHERE location_id = ${data.location_id}`;
        console.log(`entering deleteLocation: sql=${sql}`);
        let response = await connection.query(sql);
        if(response.affectedRows) {
            result = 'deleted from database'
        } else {
            result = 'was not found'
        }
        return `Location ${data.location_id} ${result}.`;
    } catch (err) {
        throw err
    } finally {
        await connection.release();
    }
}

module.exports = { getLocations, addLocation, deleteLocation };