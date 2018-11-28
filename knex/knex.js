const environment = process.env.ENVIRONMENT; // || 'development';
const options = require("../knexfile.js")[environment];
const knex = require("knex")(options);

// ----------------HELPER FUNCTIONS----------------
const getChatObjectWithOtherUser = function(request) {
  return Promise.all([
    knex
      .select()
      .from("chats")
      .where("chat_id", request.chat_id),
    knex
      .select()
      .from("users")
      .where("auth_id", request.otheruser)
  ]).then(chatTuple => {
    return {
      chat: chatTuple[0][0],
      otheruser: chatTuple[1][0]
    };
  });
};

const getUserForOverlap = function(overlap) {
  return knex
    .select()
    .from("users")
    .where("auth_id", overlap.trip_user)
    .then(profile => {
      return { connectionTrip: overlap, connectionProfile: profile[0] };
    });
};

const getConnections = function(trip) {
  return knex
    .raw(
      `
    SELECT * from trips
    WHERE trip_start <= :user_end::date
    AND trip_end >= :user_start::date
    AND trip_city = :user_trip_city
    AND trip_user != :user_trip_user
    `,
      {
        user_start: trip.details.trip_start,
        user_end: trip.details.trip_end,
        user_trip_city: trip.details.trip_city,
        user_trip_user: trip.details.trip_user
      }
    )
    .then(overlaps => {
      return Promise.all(overlaps.rows.map(getUserForOverlap));
    })
  .then(formattedConnections => {
    trip.connections = formattedConnections;
    return trip;
  })
  }

  const getChatsForUser = function(auth_id) {
    return knex.select('chat_id', 'user1', 'user2', 'updated_at').from('chats')
      .then(allChats => {
          let myChats = allChats.filter(chat => Object.values(chat).includes(auth_id));
          let sortedChats = myChats.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          let chatRequests = sortedChats.map(chat => {
            let otheruser = chat.user1 === `${auth_id}` ? chat.user2 : chat.user1;
            return {
              chat_id: chat.chat_id,
              otheruser
            }
          })
        return Promise.all(chatRequests.map(getChatObjectWithOtherUser))
      })
  }


// ----------------INITIAL QUERY----------------
const getAllUserInformation = auth_id => {
  const initialQueries = [
    // get all cities
    knex.raw(`SELECT * FROM cities`),
    // get user profile
    knex.raw(`SELECT * FROM users WHERE auth_id = :auth_id`, {auth_id: `${auth_id}`}),
    //get user's chats
    getChatsForUser(auth_id),
    // get trips and all related data
    knex
      .select()
      .from("trips")
      .where("trip_user", `${auth_id}`)
      .then(userTrips => {
        let userTripsArray = userTrips.map(userTrip => {
          return { details: userTrip, connections: [] };
        });
        return Promise.all(userTripsArray.map(getConnections));
      })
  ];

  return Promise.all(initialQueries)
    .then(completedQueries => {
      return {
        cities: completedQueries[0].rows,
        profile: completedQueries[1].rows.length
          ? completedQueries[1].rows[0]
          : null,
        messages: completedQueries[2].length ? completedQueries[2] : null,
        upcomingTrips: completedQueries[3].length ? completedQueries[3] : null
      };
    })
    .catch(err => ("error received from get initial query:", err));
};

// ----------------USER CREATE AND UPDATE----------------
// add user's auth_id to database
postUser = id => knex("users").insert({ auth_id: id });

// update auth_id entry with all profile information
updateUserProfile = profile => {
  return knex("users")
    .where({ auth_id: profile.auth_id })
    .update({
      username: profile.username,
      user_country: profile.user_country,
      picture: profile.picture,
      interests: profile.interests,
      is_guide: profile.is_guide,
      primary_lang: profile.primary_lang,
      secondary_langs: profile.secondary_langs
    })
    .returning("*");
};

// ----------------TRIP CREATE----------------
// add a new trip to db, and return that trip with connections
createTrip = trip => {
  return knex("trips")
    .insert({
      trip_user: trip.trip_user,
      trip_city: trip.trip_city,
      trip_start: trip.trip_start,
      trip_end: trip.trip_end,
      purpose: trip.purpose
    })
    .returning("*")
    .then(createdTrip => {
      return getConnections({ details: createdTrip[0], connections: [] });
    });
};


// ----------------MESSAGES CREATE/UPDATE/FETCH----------------
createChat = chat => {
  return knex("chats")
    .insert({
      user1: chat.sender,
      user2: chat.receiver,
      messages: chat.messages,
      current_length: 1,
      lastViewed1: 1,
      lastViewed2: 0,
      chat_city: chat.chat_city
    })
    .returning(["chat_id", "user2"])
    .then(chatInfo => {
      return getChatObjectWithOtherUser({
        chat_id: chatInfo[0].chat_id,
        otheruser: chatInfo[0].user2
      });
    });
};

updateChat = update => {
  console.log(update);
  return knex("chats").where({chat_id: update.chat.chat_id})
    .update({
      messages: update.chat.messages,
      current_length: update.chat.current_length,
      [update.viewCountToUpdate]: update.chat[update.viewCountToUpdate]
  })
  .then(data => {
    return getChatsForUser(`${update.user}`);
  })
};

module.exports = {
  postUser,
  updateUserProfile,
  createTrip,
  getAllUserInformation,
  createChat,
  updateChat
};
