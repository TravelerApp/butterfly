const environment = process.env.ENVIRONMENT // || 'development';
const options = require('../knexfile.js')[environment];
const knex = require('knex')(options);


  // write this async await function and store it as variable
  // async
  // await trips = knex.query for trips
  // await overlaps = trips.forEach(knex.query trip for overlap)
  // await connections = overlap.forEach(knex.query for user profile)

  const findConnections = async (tripsArray) => {
    // for each trip of tripArray, find overlaps
    //    overlap = trip with different user, same city id, and overlapping dates
  }

module.exports = {
  getAllUserInformation: (auth_id) => {
    const initialQueries = [
      knex.raw(`
      select *
      from cities
      `),

      knex.raw(`
      select *
      from users
      where auth_id = :auth_id
      `, {auth_id: `${auth_id}`}),

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

      knex.raw(`
      select *
      from trips
      where trip_user = :auth_id
      `, {auth_id: `${auth_id}`})
    ]

  return Promise.all(initialQueries)
    .then(data => {
      //findConnections(data[3].rows)
      console.log(data[2].length)
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