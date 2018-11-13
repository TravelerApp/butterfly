require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      // user: '',
      // password: '',
      database: 'butterflies'
    },
    migrations: {
      directory: './knex/migrations'
    },
    seeds: {
      directory: './knex/seeds'
    },
  },

  // production: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL // + '?ssl=true',
  // }

};
