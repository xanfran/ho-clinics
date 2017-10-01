'use strict';
const clinicsRepo = require('./clinics/clinics.js');

const repository = (db) => {

  const repo = Object.create({
    disconnect: () => {
      db.close();
    }
  });

  // Add functions into the repository to query the clinics collection
  clinicsRepo(db, repo);

  return repo;
};

// Returns a Promise that resolves the repository
const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'));
    }
    resolve(repository(connection));
  });
};

module.exports = Object.assign({}, { connect });