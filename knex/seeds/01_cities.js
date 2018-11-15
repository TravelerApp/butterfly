const citiesData = require('../seed_data/cities.js');

exports.seed = function(knex, Promise) {
  return knex('cities').del()
    .then(function () {
      return knex('cities').insert(citiesData);
    });
};