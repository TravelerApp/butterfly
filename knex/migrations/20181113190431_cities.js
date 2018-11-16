//  Create cities table that will store information for supported cities:
//    - a unique integer "city_id" for referencing city in other tables
//    - a "city" string (that is the name of the city)
//    - an optional "state/province" string
//    - a "country" string
//    - a "coordinates" json string used to store latitude and longitude of city
//    - an optional "city_picture" string to use as a reference for a background image (post-MVP)
//    - a "city_primary_lang" string
//    - a "city_secondary_langs" string that will most likely be a stringified array

exports.up = knex =>
  knex.schema.createTable('cities', table => {
      table.increments('city_id').primary();
      table.string('city');
      table.string('state');
      table.string('country');
      table.decimal('lat', null)
      table.decimal('long', null)
      table.string('city_primary_lang');
      table.json('city_secondary_langs');
      table.string('city_picture');
  });

exports.down = knex => knex.schema.dropTable('cities');