'use strict';
const express = require('express');
const morgan = require('morgan');
const api = require('../api');

const start = (options) => {
  return new Promise((resolve, reject) => {

    if (!options || !options.port) {
      reject(new Error('The server must be started with an available port'));
    }

    // Create the express app
    const app = express();
    // Log HTTP requests
    app.use(morgan('dev'));
    // Handle errors and return a "500 Internal error" HTTP code
    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err));
      res.status(500).send('Something went wrong!');
    });

    // Add API endpoints in the express app
    api.initAPI(app, options);

    // Start the server in the desired port
    const server = app.listen(options.port, () => {
      resolve(server);
    });
  });
};

module.exports = { start };