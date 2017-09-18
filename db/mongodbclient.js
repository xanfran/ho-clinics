'use strict';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
let url = 'mongodb://localhost:27017/clinics';

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    MongoClient.connect(url, {
      db: url
    }, (err, db) => {
      if (err) {
        mediator.emit('db.error', err);
      }

      db.admin().authenticate(options.user, options.pass, (err, result) => {
        if (err) {
          mediator.emit('db.error', err);
        }
        mediator.emit('db.ready', db);
      });

    });
  });
};



module.exports = { connect };