/* eslint-env mocha */
'use strict';
const request = require('supertest');
const assert = require('assert');
const server = require('../server/server');

describe('Clinics API', () => {
  let app = null;
  let testClinics = [{
    "postcode": "W5 2AB",
    "partial_postcode": "W5",
    "organisation_id": "12345",
    "name": "Ealing Broadway Chiropractic Clinic",
    "city": "Ealing"
  },{
    "postcode": "W13 0SY",
    "partial_postcode": "W13",
    "organisation_id": "67890",
    "name": "Ealing Dental Care",
    "city": "Ealing"
  }];

  // Test repository that allow us to test the apoi without modifing the exiting
  // DB
  let testRepo = {
    getClinicsByPostcode (postcode) {
      return Promise.resolve(testClinics
          .filter(clinic => clinic.partial_postcode === postcode)
          .map(clinic => {
            return {
              organisation_id: clinic.organisation_id,
              name: clinic.name
            };
          }));
    },
    getClinicsByCity (name) {
      return Promise.resolve(testClinics
          .filter(clinic => clinic.city === name)
          .reduce((result, clinic) => {
            if (!result[clinic.partial_postcode]) {
              result[clinic.partial_postcode] = 0;
            }
            result[clinic.partial_postcode]++;
            return result;
          }, {}));
    }
  };

  beforeEach(() => {
    return server.start({
      port: 8181,
      repository: testRepo
    }).then(server => {
      app = server;
    });
  });

  afterEach(() => {
    app.close();
    app = null;
  });

  it('can get clinics by post code', (done) => {
    request(app)
    .get('/clinics/postcode/W5')
    .expect((res) => {
      assert.deepEqual(res.body, {
        results: [{
          "organisation_id": "12345",
          "name": "Ealing Broadway Chiropractic Clinic"
        }]
      });
    })
    .expect(200, done);
  });

  it('can get clinics grouped by partial_code', (done) => {
    request(app)
      .get('/clinics/city/Ealing')
      .expect((res) => {
        assert.deepEqual(res.body, { results: { W5: 1, W13: 1 } });
      })
      .expect(200, done);
  });
});