const environment = process.env.ENVIRONMENT // || 'development';
const options = require('../knexfile.js')[environment];
const knex = require('knex')(options);


// overlaps = trips.forEach(knex.query trip for overlap)
// connections = overlap.forEach(knex.query for user profile)

const Queries = {
}

module.exports = {
  getAllUserInformation: (auth_id) => {
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
          let finalChatObjects = Promise.all(data.map(getChatObjectWithOtherUser))
          return finalChatObjects;
          }),
      // get trips and all related data
      knex.select().from('trips').where('trip_user', `${auth_id}`)
        .then(usertrips => {
          let usertripsArray = usertrips.map(usertrip => {return {details: usertrip, connections: []}});
          let usertripsWithConnections = Promise.all(usertripsArray.map(getConnections));
          return usertripsWithConnections;
          // let fullOverlapObjects = Promise.all(tripsWithOverlaps.map())
          // return tripsWithOverlaps;
        })
    ]

  return Promise.all(initialQueries)
    .then(data => {
      return data
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
    overlaps.rows.forEach(async overlap => {
      const connectionProfile = await getUserForOverlap(overlap);
      trip.connections.push({connectionTrip: overlap, connectionProfile: connectionProfile[0]})
    })
    return trip;
  })
}



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