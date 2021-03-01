const express = require('express');
const sls = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { getUsers, addUser, verifyUser, deleteUser, updateUser } = require('./src/models/users');
const { getRoles } = require('./src/models/roles');
const locationHandler = require('./src/models/locations');
const sessionHandler = require('./src/models/sessions');
const adventureHandler = require('./src/models/adventures');
const characterHandler = require('./src/models/characters');
const settlementHandler = require('./src/models/settlements');

// This may also allow CORS. Have not tested yet.
// const cors = require('cors');
// app.use(cors());

// Fix header to allow cross-origin
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization");
  res.header('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, DELETE");
  res.header('Access-Control-Allow-Credentials', 'true');
  if(req.method == "OPTIONS") {
    res.status(204).send();
    return
  }
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
app.route(`/user/:user_id`)
.delete(async (req, res) => {
  try {
    let results = await deleteUser(req.params);
    res.status(200).send(results);
  } catch(err) {
    res.status(400).send(err.message);
  }
})
.put(async (req, res) => {
  try {
    let results = await updateUser(req.params.user_id, req.body);
    res.status(200).send(results);
  } catch(err) {
    res.status(400).send(err.message);
  }
})
;


// Routing all Roles queries
app
  .get('/roles', async (req, res, next) => {
  // Fetch all roles from DB
  let results = await getRoles();
  res.status(200).send(results);
});

app
  .post('/login', async (req, res) => {

    try {
      
      const email_address = req.body.email_address;
      const password = req.body.password;

      console.log('INCOMING BODY: ', req.body);

      let results = await verifyUser(email_address, password);

      if (Array.isArray(results) && results.length) {
        res.status(200).send(results[0]);
      } else {
        res.status(401).send( { message: 'User login failed.'});
      }


  } catch(err) {
      res.status(401).send( { message: err.message, error: err})
    }
  });

// Genericized CRUD operation for backend data tablse
function crudRoutes(entity_type, ormHandler) {
  //TODO: move these to entityDef & share w/ front-end
  const entity_type_plural = entity_type + 's';
  const entity_type_id_field = entity_type + '_id';

  app.route(`/${entity_type_plural}`)
  .get(async (req, res) => {
    let results = await ormHandler.getRecords();
    res.status(200).send(results);
  })
  .post(async (req, res) => {
    try {
      let results = await ormHandler.addRecord(req.body);
      res.status(200).send(results);
    } catch(err) {
      res.status(400).send(err.message);
    }
  })
  ;

  app.route(`/${entity_type}/:${entity_type_id_field}`)
  .delete(async (req, res) => {
    try {
      let results = await ormHandler.deleteRecord(req.params);
      res.status(200).send(results);
    } catch(err) {
      res.status(400).send(err.message);
    }
  })
  .put(async (req, res) => {
    try {
      let results = await ormHandler.updateRecord(req.params[entity_type_id_field], req.body);
      res.status(200).send(results);
    } catch(err) {
      res.status(400).send(err.message);
    }
  })
  ;
}

// Route setup for standard CRUD operations
crudRoutes('character', characterHandler);
crudRoutes('location', locationHandler);
crudRoutes('settlement', settlementHandler);
crudRoutes('adventure', adventureHandler);
crudRoutes('session', sessionHandler);

// Route setup for fetch operations with custom queries.
app.route(`/sessions/view`)
.get(async (req, res) => {
  let results = await sessionHandler.getView();
  res.status(200).send(results);
})
app.route(`/adventures/view`)
.get(async (req, res) => {
  let results = await adventureHandler.getView();
  res.status(200).send(results);
})


module.exports.express = app;
module.exports.server = sls(app);
