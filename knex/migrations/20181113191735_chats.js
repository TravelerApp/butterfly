//  Create chats table that will store information for supported cities:
//    - a unique integer "chat_id" for referencing the chat
//    - a "user1" foreign key that references a user
//    - a "user2" foreign key that references a user
//    - a "messages" json string that is an array of message objects
//    - a "current_length" integer that is the current number of messages in array
//    - a "lastViewed1" integer that represents that last message viewed by user1
//    - a "lastViewed1" integer that represents that last message viewed by user1
//    - a "chat_city" foreign key that references the city the two users are visiting
//    - timestamps for checking if message needs to be updated

const { onUpdateTrigger } = require('../../knexfile.js')

exports.up = knex =>
  knex.schema.createTable('chats', table => {
      table.increments('chat_id').primary();
      table.string('user1').references('auth_id').inTable('users').notNullable().onDelete('cascade');
      table.string('user2').references('auth_id').inTable('users').notNullable().onDelete('cascade');
      table.boolean('connected').defaultTo(false);
      table.json('messages');
      table.integer('current_length').defaultTo(0);
      table.integer('lastViewed1').defaultTo(0);
      table.integer('lastViewed2').defaultTo(0);
      table.integer('chat_city').references('city_id').inTable('cities').notNullable().onDelete('cascade');
      table.timestamps(true, true);
  })
  .then(() => knex.raw(onUpdateTrigger('chats')));


exports.down = knex => knex.schema.dropTable('chats');