// Add new API endpoints by importing the files in this file and add them inside
// of the initAPI function
'use strict';
const clinicsAPI = require('./clinics');

const initAPI = (app, options) => {
  // Add cities API to the express app
  clinicsAPI(app, options);
};

module.exports = { initAPI };
