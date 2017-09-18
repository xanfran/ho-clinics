'use strict';
const server = require('./server/server');
const config = require('./config');
const dbClient = require('./db');
const repository = require('./repository/clinics/clinics');
const EventEmitter = require('events');
const mediator = new EventEmitter();

// Handle global errors
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err);
});
process.on('uncaughtRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server when the DB is ready
mediator.on('db.ready', (db) => {
  let rep;
  repository.connect(db)
    .then(repo => {
      console.log('Repository Connected. Starting Server');
      rep = repo;
      return server.start({ port: config.serverSettings.port, repository: rep });
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${config.serverSettings.port}.`);
      app.on('close', () => {
        rep.disconnect();
      });
    });


});
mediator.on('db.error', (err) => {
  console.error(err);
});

// Connect the DB
dbClient.connect(config.dbSettings, mediator);
// Notifiy through the emiter that the boot has finished
mediator.emit('boot.ready');