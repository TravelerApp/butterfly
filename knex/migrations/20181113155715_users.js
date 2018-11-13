//  Create users table that will store profile information:
//    - a unique string "id" that will likely be the user's google id returned from OAuth
//    - a "username" string entered by the user upon profile creation
//    - a "picture" string that will point to a resource hosted somewhere else on the internet
//    - an "interests" string that will most likely be a stringified object
//        - {hiking: true, museums: false...}
//    - a "guide" Boolean for later use (post-MVP)
//    - a "primary language" string
//    - a "secondary language" string that will most likely be a stringified array
//    - timestamps - created/updated? (who knows, might want these later)

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.string('username')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('users')
  ])
};