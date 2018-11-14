const environment = process.env.ENVIRONMENT // || 'development';
const options = require('../knexfile.js')[environment];
const knex = require('knex')(options);


// WRITE database modules
//    module.exports.MODELNAME
//       knex.

module.exports = knex;
