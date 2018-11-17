const environment = process.env.ENVIRONMENT; // || 'development';
const options = require("../knexfile.js")[environment];
const knex = require("knex")(options);


  const getAllUserInformation = (auth_id) => {
    const initialQueries = [
      // get all cities
      knex.raw(`SELECT * FROM cities`),
      // get user profile
      knex.raw(`SELECT * FROM users WHERE auth_id = :auth_id`, {auth_id: `${auth_id}`}),
      //get user's chats
      knex.select('chat_id', 'user1', 'user2').from('chats')
        .then(allChats => {
            let myChats = allChats.filter(chat => Object.values(chat).includes(auth_id));
            return myChats.map(chat => {
              let otheruser = chat.user1 === `${auth_id}` ? chat.user2 : chat.user1;
              return {
                chat_id: chat.chat_id,
                otheruser
              }
            })
          })
        .then(data => {
          return Promise.all(data.map(getChatObjectWithOtherUser))
          .then(data => data)
          }),
      // get trips and all related data
      knex.select().from('trips').where('trip_user', `${auth_id}`)
        .then(userTrips => {
          let userTripsArray = userTrips.map(userTrip => {return {details: userTrip, connections: []}});
          return Promise.all(userTripsArray.map(getConnections))
          .then(trips => {
            return trips;
          })
        })
    ]

  return Promise.all(initialQueries)
    .then(data => {
      let initialStoreState = {
        cities: data[0].rows,
        profile: data[1].rows,
        messages: data[2].map(tuple => {
          return {
            message: tuple[0][0],
            otheruser: tuple[1][0]
          }
        }),
        upcomingTrips: data[3]
      }
      return initialStoreState;
    })
  }
}

const getChatObjectWithOtherUser = function(request) {
  return Promise.all([
    knex.select().from('chats').where('chat_id', request.chat_id),
    knex.select().from('users').where('auth_id', request.otheruser)
  ])
  .then(data => data)
}
const getUserForOverlap = function(overlap) {
  return knex.select().from('users').where('auth_id', overlap.trip_user)
  .then(profile => {
    return {connectionTrip: overlap, connectionProfile: profile[0]}
  })
}

const getConnections = function(trip) {
  return knex.raw(`
    SELECT * from trips
    WHERE trip_start <= :user_end::date
    AND trip_end >= :user_start::date
    AND trip_city = :user_trip_city
    AND trip_id != :user_trip_id
    AND trip_user != :user_trip_user
    `, {
      user_start: trip.details.trip_start,
      user_end: trip.details.trip_end,
      user_trip_city: trip.details.trip_city,
      user_trip_id: trip.details.trip_id,
      user_trip_user: trip.details
    })
  .then(overlaps => {
    return Promise.all(overlaps.rows.map(getUserForOverlap))
    })
  .then(data => {
    trip.connections = data;
    return trip;
  })
  }


    // let ConnectionObjects = [];
    // overlaps.rows.forEach(overlap => {
    //   ConnectionObjects.push(getUserForOverlap(overlap))
    // })
    // return Promise.all(ConnectionObjects)
    // .then((data) => {
    //   console.log(data[0])
    // })
      //trip.connections.push({connectionTrip: overlap, connectionProfile: connectionProfile[0]})
      //})
    //return trip;



//   loggedIn: currentuser.id,
//   cities: allcities ------------------------- [[GOT IT - 1st item in response]]

//   profile: {currentUserprofile} ------------- [[GOT IT - 2nd item in response]]

//   messages: [{convo},{convo}, ...] ---------- [[GOT IT - 3rd item in response]]

//   currentTrips: [
//     {
//       details: {tripdata},
//       connections: [
//         {
//           connection: {conn_proflle},
//           connectionTrip: {conn_trip}
//         },
//         {
//           connection: {conn_proflle},
//           connectionTrip: {conn_trip}
//         }
//       ]
//     },
//     {
//       details: {tripdata},
//       connections: [
//         {
//           connection: {conn_proflle},
//           connectionTrip: {conn_trip}
//         },
//         {
//           connection: {conn_proflle},
//           connectionTrip: {conn_trip}
//         }
//       ]
//     }
//   ],

// LOGIN/SIGNUP TIMELINE
// -> returns authid
// -> check database for authid
//   1) if authid is not in the database, save it, redirect to create profile
//*******   2) if authid IS in database
//*******       1) authid HAS a username, initiate call to grab profile information (ALL of it)
//           1) hastrips -> redirect to trips page
//           2) notrips -> redirect to add trip
//       2) authID does NOT have a username, redirect to create profile

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
  getAllUserInformation
};

