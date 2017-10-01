'use strict';
const fs = require('fs');
const path = require('path');

module.exports = (db, repository) => {
  const collection = db.collection('clinics');

  // Add clinics into the db if the collection is empty
  collection.count().then(total => {
    if (total === 0) {
      collection.insertMany(JSON.parse(fs.readFileSync(
          path.join(__dirname, 'sample_data.json'), 'utf8')));
    }
  });

  const getClinicsByPostcode = (postcode) => {
    return new Promise((resolve, reject) => {
      const clinics = [];
      const partialPostcode = postcode.split(' ')[0];
      // Return empty results if there is no partialPostcode
      if (!partialPostcode) {
        resolve(clinics);
        return;
      }
      // User RegExp to ignore case
      const query = { partial_postcode: new RegExp(partialPostcode, 'i') };
      // Select the fields of the clinics to return
      const projection = { _id: 0, organisation_id: 1, name: 1 };
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
        // partial_postcode to initiliaze it
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

  Object.assign(repository, { getClinicsByPostcode, getClinicsByCity });
};