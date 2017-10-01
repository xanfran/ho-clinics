# Clinics API example

Small microservice that provides data on UK clinics.

## Description

This microservice was developed using `nodejs v4.2.6`. In order to install the Node.js dependencies run `npm install`. This project expects to have MongoDB install in the machine and the DB URL can be defined in the `./config/db.js` file or by the node environment variable `DB_URL`.

The API is defined inside of the `./api` folder and can be easily extended by importing new API files inside of the `./api/index.js` file.

### Scripts

There are several scripts defined in the package.json:

* `test`: runs the tests
* `debug:app`: starts the app in debugging mode
* `lint`: analyses the code to detect errors and potential problems