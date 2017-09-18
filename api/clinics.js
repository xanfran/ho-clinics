'use strict';
const status = require('http-status');

module.exports = (app, options) => {
  const repository = options.repository;

  // Postcode endpoint
  app.get('/clinics/postcode/:postcode', (req, res, next) => {
    repository.getClinicsByPostcode(req.params.postcode).then(clinics => {
      res.set('Content-Type', 'application/json');
      res.status(status.OK).json({ results: clinics });
    }).catch(next);
  });

  // City name endpoint
  app.get('/clinics/city/:name', (req, res, next) => {
    repository.getClinicsByCity(req.params.name).then(results => {
      res.set('Content-Type', 'application/json');
      res.status(status.OK).json({ results: results });
    }).catch(next);
  });

};
