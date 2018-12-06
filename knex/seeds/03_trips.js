const tripsData = require("../seed_data/Abdullah_trips.js");

exports.seed = function(knex, Promise) {
  return knex("trips")
    .del()
    .then(function() {
      return knex("trips").insert(tripsData);
    });
};
