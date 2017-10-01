const dbSettings = {
  url: process.env.DB_URL || 'mongodb://localhost:27017/clinics'
};

// Create a new object to prevent modifications in these settings
module.exports = Object.assign({}, dbSettings);