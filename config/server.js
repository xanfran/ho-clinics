const serverSettings = {
  port: process.env.PORT || 9000
};

// Create a new object to prevent modifications in these settings
module.exports = Object.assign({}, serverSettings);