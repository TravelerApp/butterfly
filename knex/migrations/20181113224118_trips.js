//  Create chats table that will store information for trips:
//    - a unique integer "trip_id" for referencing the trip
//    - a "trip_user" foreign key that references a user
//    - "trip_start" and "trip_end" date types that reference the trip dates
//    - a "purpose" string that is the user's description of their trip
//    - a "trip_city" foreign key that references the city_id in the cities table

exports.up = knex =>
  knex.schema.createTable('trips', table => {
      table.increments('trip_id').primary();
      table.string('trip_user').references('auth_id').inTable('users').notNullable().onDelete('cascade');
      table.integer('trip_city').references('city_id').inTable('cities').notNullable().onDelete('cascade');
      table.date('trip_start');
      table.date('trip_end');
      table.string('purpose', 5000);
  });

exports.down = knex => knex.schema.dropTable('trips');
