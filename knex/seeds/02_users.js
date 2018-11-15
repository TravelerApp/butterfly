const usersData = require('../seed_data/users.js');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert(usersData);
    });
};