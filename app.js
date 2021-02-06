const express = require('express');
const sls = require('serverless-http');
const app = express();
const { getUsers, addUser } = require('./src/models/users');
const { getRoles } = require('./src/models/roles');

// Fix header to allow cross-origin
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
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
    let results = await addUser(req.body);
  res.status(200).send(results);
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

module.exports.server = sls(app);