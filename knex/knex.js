const environment = process.env.ENVIRONMENT; // || 'development';
const options = require("../knexfile.js")[environment];
const knex = require("knex")(options);

getUsers = callback => {
  knex("users").then(data => {
    callback(data);
  });
};

getTrips = callback => {
  knex("trips").then(data => {
    callback(data);
  });
};

postUser = id => {
  knex("users")
    .insert({ auth_id: id })
    .then(console.log("user was inserted"));
};

updateUserProfile = body => {
  knex("users")
    .where({ auth_id: body.auth_id })
    .update({
      username: body.username,
      user_country: body.user_country,
      picture: body.picture,
      interests: body.inserts,
      is_guide: body.is_guide,
      primary_lang: body.primary_lang,
      secondary_langs: body.secondary_langs
    })
    .then(console.log("user profile updated"));
};

insertTrip = body => {
  knex("trips")
    .insert({
      trip_user: body.trip_user,
      trip_city: body.trip_city,
      trip_start: body.trip_start,
      trip_end: body.trip_end,
      purpose: body.purpose
    })
    .then(console.log("trip was inserted"));
};

module.exports = {
  getUsers,
  getTrips,
  postUser,
  updateUserProfile,
  insertTrip
};
