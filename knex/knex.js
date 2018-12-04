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

const getConnections = function(trip, blockedUsers) {
  let filteredUsers = Object.keys(blockedUsers).concat(trip.details.trip_user)
    .map(user => `CAST(${user} AS varchar)`).join(',');
  return knex
  .raw(
    `
    SELECT * from trips
    WHERE trip_start <= :user_end::date
    AND trip_end >= :user_start::date
    AND trip_city = ${trip.details.trip_city}
    AND trip_user not in (${filteredUsers})
    `,
    {
      user_start: trip.details.trip_start,
      user_end: trip.details.trip_end,
    }
  )
  .then(overlaps => {
    return Promise.all(overlaps.rows.map(getUserForOverlap));
  })
  .then(formattedConnections => {
    trip.connections = formattedConnections;
    return trip;
  })
  .catch(err => console.log('error in getConnections:', err))
  }

  const getAccessToBlockedArray = function(auth_id) {
    return knex.select('blocked').from('users').where({auth_id: `${auth_id}`})
    .then(blocked => blocked[0].blocked)
  }

  const getAllChatsForUser = async function(auth_id) {
    let blockedForUser = await getAccessToBlockedArray(auth_id);
    return knex.select('chat_id', 'user1', 'user2', 'updated_at').from('chats')
    .then(allChats => {
      let myChats = allChats.filter(chat => Object.values(chat).includes(auth_id) && !((chat.user1 in blockedForUser) || (chat.user2 in blockedForUser)));
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
    .catch(err => console.log('err in getAllChatsForUser:', err))
  }

  const getAllTripsForUser = async function(auth_id) {
    let blockedForUser = await getAccessToBlockedArray(auth_id);
    return knex.select().from("trips").where("trip_user", `${auth_id}`)
    .then(userTrips => {
      let userTripsArray = userTrips.map(userTrip => {
        return { details: userTrip, connections: [] };
      });
      return Promise.all(userTripsArray.map((userTrip) => getConnections(userTrip, blockedForUser)));
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
    getAllChatsForUser(auth_id),
    // get trips and all related data
    getAllTripsForUser(auth_id)
    ];

  return Promise.all(initialQueries)
    .then(completedQueries => {
      return {
        cities: completedQueries[0].rows,
        profile: completedQueries[1].rows.length
          ? completedQueries[1].rows[0]
          : null,
        messages: completedQueries[2].length ? completedQueries[2] : null,
        upcomingTrips: completedQueries[3].length ? completedQueries[3] : null,
      };
    })
    .catch(err => ("error received from get initial query:", err));
};

// ----------------USER CREATE AND UPDATE----------------
// add user's auth_id to database
postUser = id => knex("users").insert({ auth_id: id });

// update auth_id entry with all profile information
updateUserProfile = update => {
  return knex("users")
    .where({ auth_id: update.auth_id })
    .update({
      username: update.username,
      user_country: update.user_country,
      picture: update.picture,
      interests: update.interests,
      is_guide: update.is_guide,
      primary_lang: update.primary_lang,
      secondary_langs: update.secondary_langs,
      blocked: {}
    })
    .returning("*");
};

// block two auth_ids from each other
blockUser = blockInfo => {
  console.log('trying to block user:', blockInfo)
  let blockQueries = [
    knex('users').where({auth_id: blockInfo.user}).update({blocked: blockInfo.newUserBlocked})
    .then(data => {
      let updateQueries = [
        getAllChatsForUser(blockInfo.user),
        getAllTripsForUser(blockInfo.user),
        knex.raw(`SELECT * FROM users WHERE auth_id = :auth_id`, {auth_id: blockInfo.user})
      ]
      return Promise.all(updateQueries);
    }),
    knex('users').where({auth_id: blockInfo.toBlock}).update({blocked: blockInfo.newOtheruserBlocked})
  ]
  return Promise.all(blockQueries)
  .then(updates => {
    return {
      messages: updates[0][0],
      trips: updates[0][1],
      profile: updates[0][2].rows[0]
    }
  })
}


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
  // double check that the user1/user2/city combo does not already exist in the database
  // if it does not:
  return knex("chats")
    .insert({
      user1: chat.sender,
      user2: chat.receiver,
      messages: chat.messages,
      chat_city: chat.chat_city
    })
    .then(data => {
      return getAllChatsForUser(`${chat.sender}`);
    });
};

updateChat = update => {
  console.log(update);
  if (update.action === 'complete connection') {
    return knex('chats').where({
      user1: update.user1,
      user2:  update.user2,
      chat_city: update.chat_city
    }).update({
      connected: true
    })
    .then(data => {
    return getAllChatsForUser(`${update.user2}`);
    })
  }
  if (update.action === 'new message') {
    return knex("chats").where({chat_id: update.chat.chat_id})
    .update({
      messages: update.chat.messages,
      current_length: update.chat.current_length,
      [update.viewCountToUpdate]: update.chat[update.viewCountToUpdate]
    })
    .then(data => {
    return getAllChatsForUser(`${update.user}`);
    })
  }
};

module.exports = {
  getAllUserInformation,
  postUser,
  updateUserProfile,
  blockUser,
  createTrip,
  createChat,
  updateChat,
};
