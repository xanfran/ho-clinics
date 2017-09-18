const dbSettings = {
  user: process.env.DB_USER || 'user',
  pass: process.env.DB_PASS || 'password'
};

// Create a new object to prevent modifications in these settings
module.exports = Object.assign({}, dbSettings);