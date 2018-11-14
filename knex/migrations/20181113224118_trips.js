//  Create chats table that will store information for trips:
//    - a unique integer "trip_id" for referencing the trip
//    - a "trip_user" foreign key that references a user
//    - "trip_start" and "trip_end" date types that reference the trip dates
//    - a "purpose" string that is the user's description of their trip
//    - a "trip_city" foreign key that references the city_id in the cities table

exports.up = function(knex, Promise) {
  return knex.schema.createTable('trips', function(table) {
      table.increments('trip_id').primary();
      table.string('trip_user').references('auth_id').inTable('users').notNullable().onDelete('cascade');
      table.date('trip_start');
      table.date('trip_end');
      table.string('purpose');
      table.integer('trip_city').references('city_id').inTable('cities').notNull().onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trips');
};
