'use strict';
const fs = require('fs');
const path = require('path');

// Function that exposes functions for accessing the data
const repository = (db) => {

  const collection = db.collection('clinics');

  // Check if the DB has some data; otherwise add the sample data into the DB
  collection.count().then(total => {
    if (total === 0) {
      collection.insertMany(JSON.parse(fs.readFileSync(
          path.join(__dirname, 'sample_data.json'), 'utf8')));
    }
  });

  const getClinicsByPostcode = (postcode) => {
    return new Promise((resolve, reject) => {
      const projection = { _id: 0, organisation_id: 1, name: 1 };
      const clinics = [];
      const partialPostcode = postcode.split(' ')[0];
      // User RegExp to ignore case
      const query = { partial_postcode: new RegExp(partialPostcode, 'i') };
      const cursor = collection.find(query, projection);
      const addClinic = (clinic) => {
        clinics.push(clinic);
      };
      const resolveClinics = (err) => {
        if (err) {
          reject(new Error('An error occured retrieving the clinics, err:' + err));
        }
        resolve(clinics);
      };
      cursor.forEach(addClinic, resolveClinics);
    });
  };

  const getClinicsByCity = (cityName) => {
    return new Promise((resolve, reject) => {
      const results = {};
      // User RegExp to ignore case
      const query = { city: new RegExp(cityName, 'i') };
      const cursor = collection.find(query);
      const addResult = (result) => {
        // Check if the results object does not have the current
        // partial_postcode
        if (!results[result.partial_postcode]) {
          results[result.partial_postcode] = 0;
        }
        results[result.partial_postcode]++;
      };
      const resolveResults = (err) => {
        if (err) {
          reject(new Error('An error occured retrieving the clinics, err:' + err));
        }
        resolve(results);
      };
      cursor.forEach(addResult, resolveResults);
    });
  };

  const disconnect = () => {
    db.close();
  };

  return Object.create({
    getClinicsByPostcode,
    getClinicsByCity,
    disconnect
  });
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