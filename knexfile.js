require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      // user: '',
      // password: '',
      database: "butterflies"
    },
    migrations: {
      directory: "./knex/migrations"
    },
    seeds: {
      directory: "./knex/seeds"
    }
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE
      // user: '',
      // password: '',
    },
    migrations: {
      directory: "./knex/migrations"
    },
    seeds: {
      directory: "./knex/seeds"
    }
  },

  // production: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL // + '?ssl=true',
  // }

  onUpdateTrigger: table => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
};
