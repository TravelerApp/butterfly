const chatsData = require('../seed_data/chats.js');

exports.seed = function(knex, Promise) {
  return knex('chats').del()
    .then(function () {
      return knex('chats').insert(chatsData);
    });
};