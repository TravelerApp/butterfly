//  Create chats table that will store information for supported cities:
//    - a unique integer "chat_id" for referencing the chat
//    - a "user1" foreign key that references a user
//    - a "user2" foreign key that references a user
//    - a "messages" json string that is an array of message objects
//    - a "current_length" integer that is the current number of messages in array
//    - a "lastViewed1" integer that represents that last message viewed by user1
//    - a "lastViewed1" integer that represents that last message viewed by user1
//    - timestamps for checking if message needs to be updated
//    - DO WE WANT A FOREIGN KEY THAT REFERENCES A TRIP ID?

exports.up = function(knex, Promise) {
  return knex.schema.createTable('chats', function(table) {
      table.increments('chat_id').primary();
      table.string('user1').references('auth_id').inTable('users').notNullable().onDelete('cascade');
      table.string('user2').references('auth_id').inTable('users').notNullable().onDelete('cascade');
      table.json('messages');
      table.integer('current_length');
      table.integer('lastViewed1');
      table.integer('lastViewed2');
      table.timestamps(true, true);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chats');
};