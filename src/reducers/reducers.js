

global states needed:

Logged in user(Name and Profile): 

User Trips array   each trip->{
    trips: trips array/object
    connections: users overlap list for THIS TRIP


Messages Data (All rows with User in user1 or user2):

Potential Connections List(Names and Profiles):

Create Profile Form Data

Add Trip Form Data

Selected Trip


State = {
  cities: allcities,
  loggedIn: currentuser.id,
  profile: currentUser profile ,
  currentTrips: [{
    Trip: trip 1 data,
    Trip1Connections: [{
      possibleConnection1: proflle,
      possCon1Trip: posCons Trip,
    }, {
      possibleConnection2: proflle,
      possCon2Trip: posCons Trip,
    }],
  }, {
    Trip: trip 2 data,
    Trip2Connections: [{
      possibleConnection1: proflle,
      possCon1Trip: posCons Trip,
    }, {
      possibleConnection2: proflle,
      possCon2Trip: posCons Trip,
    }],
  }],
  messages: [array of each conversation],
  selectedTrip: null until trip is selected,
  selectedPossCon: selected Possible Connection,
  selectedConUser: selected user for messages,

}