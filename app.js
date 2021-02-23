const express = require('express');
const sls = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { getUsers, addUser } = require('./src/models/users');
const { getRoles } = require('./src/models/roles');
const { getLocations, addLocation } = require('./src/models/locations');

// Fix header to allow cross-origin
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routing all Users queries
app.route('/users')
  .get(async (req, res) => {
    // Fetch all users from DB
    let results = await getUsers();
    res.status(200).send(results);
})
  .post(async (req, res) => {
    try {
      let results = await addUser(req.body);
      res.status(200).send(results);
    } catch(err) {
      res.status(400).send(err.message);
    }
})
  .put(async (req, res) => {
  res.status(200).send('YOU UPDATED A USER.');
})
  .delete(async (req, res) => {
  res.status(200).send('DELETED!!!!');
});

// Routing all Roles queries
app
  .get('/roles', async (req, res, next) => {
  // Fetch all roles from DB
  let results = await getRoles();
  res.status(200).send(results);
});

// Routing all Locations queries
app
  .get('/locations', async (req, res, next) => {
  // Fetch all locations from DB
  let results = await getLocations();
  res.status(200).send(results);
});

module.exports.express = app;
module.exports.server = sls(app);
