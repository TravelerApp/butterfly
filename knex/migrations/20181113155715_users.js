//  Create users table that will store profile information:
//    - a unique string "auth_id" that will likely be the user's google id returned from OAuth
//    - a "username" string entered by the user upon profile creation
//    - a "picture" string that will point to a resource hosted somewhere else on the internet (S3)
//    - a "user_country" string that will be the user's home country
//    - an "interests" json string that will most likely be a stringified object
//        - {hiking: true, museums: false...}
//    - an "is_guide" Boolean for later use (post-MVP)
//    - a "primary_lang" string
//    - a "secondary_langs" string that will most likely be a stringified array
//    - timestamps - created/updated? (who knows, might want these later)

const { onUpdateTrigger } = require('../../knexfile.js')

exports.up = knex =>
  knex.schema.createTable('users', table => {
      table.string('auth_id').unique().notNullable().primary();
      table.string('username')//.notNullable();
      table.string('user_country');
      table.string('picture');
      table.json('interests');//.notNullable();
      table.boolean('is_guide').defaultTo(false);
      table.string('primary_lang')//.notNullable();
      table.json('secondary_langs');
      table.json('blocked');
      table.timestamps(true, true);
  })
  .then(() => knex.raw(onUpdateTrigger('users')));

exports.down = knex => knex.schema.dropTable('users');