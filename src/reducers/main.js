import {
  GRAB_EVERYTHING,
  SAVE_PROFILE,
  ADD_TRIP,
  SELECT_TRIP,
  SELECT_CITY,
  SELECT_POSS_CON,
  SELECT_CONNECTION,
  NEW_MESSAGE,
  UPDATE_MESSAGES,
  //UNSELECT_TRIP,
  LOG_OUT,
  GRAB_COUNTRIES,
  SELECT_COUNTRY,
  SELECT_CITIES,
  TOGGLE_ADDED,
  LOG_IN,
  UPDATE_BLOCK
} from "../actions/actions.js";

const initialState = {
  cities: null,
  loggedIn: null,
  profile: null,
  currentTrips: null,
  messages: null,
  selectedTrip: null,
  selectedPossCon: null,
  selectedConnection: null,
  countries: ["test"],
  currentCountry: "select a country",
  currentCity: null,
  currentCities: ["select a country to see cities"],
  tripAdded: false,
  newUser: true,
  sortedMessageData: null
};

const sortMessageData = function (messages) {
  let sortedMessages = {
    active: {},
    requestSent: {},
    requestReceived: {},
    ongoingMessages: [],
    newConnections: []
  };

  if (messages) {
    for (let message of messages) {
      let otherId = message.otheruser.auth_id;
      let messageCity = message.chat.chat_city;
      if (message.chat.connected === true) {
        sortedMessages.active[otherId] = sortedMessages.active[otherId] ? sortedMessages.active[otherId].concat(messageCity) : [messageCity];
        if (message.chat.messages.messages.length === 0) {
          sortedMessages.newConnections.push(message);
        } else {
          sortedMessages.ongoingMessages.push(message);
        }
      } else if (message.chat.user2 === message.otheruser.auth_id) {
        sortedMessages.requestSent[otherId] = sortedMessages.requestSent[otherId] ? sortedMessages.requestSent[otherId].concat(messageCity) : [messageCity];
      } else {
        sortedMessages.requestReceived[otherId] = sortedMessages.requestReceived[otherId] ? sortedMessages.requestReceived[otherId].concat(messageCity) : [messageCity];
      }
    }
  }

  return sortedMessages;
}

var rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_PROFILE:
      return Object.assign({}, state, {
        profile: action.payload
      });
    case GRAB_COUNTRIES:
      return Object.assign({}, state, {
        countries: action.payload
      });
    case TOGGLE_ADDED:
      return Object.assign({}, state, {
        tripAdded: action.payload
      });
    case SELECT_COUNTRY:
      return Object.assign({}, state, {
        currentCountry: action.payload
      });
    case SELECT_CITIES:
      return Object.assign({}, state, {
        currentCities: action.payload
      });
    case SELECT_CITY:
      return Object.assign({}, state, {
        currentCity: action.payload
      });
    case ADD_TRIP:
      return Object.assign({}, state, {
        currentTrips: [...state.currentTrips, action.payload]
      });
    case SELECT_TRIP:
      return Object.assign({}, state, {
        selectedTrip: action.payload
      });
    case SELECT_POSS_CON:
      return Object.assign({}, state, {
        selectedPossCon: action.payload
      });
    case SELECT_CONNECTION:
      return Object.assign({}, state, {
        selectedConnection: action.payload
      });
    case NEW_MESSAGE:
      let newSelectedConnection = Object.assign({}, state.selectedConnection, {
        chat: action.payload
      })
      return Object.assign({}, state, {
        selectedConnection: newSelectedConnection
      });
    case UPDATE_MESSAGES:
      return Object.assign({}, state, {
        messages: action.payload,
        sortedMessageData: sortMessageData(action.payload)
      });
    case UPDATE_BLOCK:
      return Object.assign({}, state, {
        profile: action.payload.profile,
        currentTrips: action.payload.trips,
        messages: action.payload.messages,
        sortedMessageData: sortMessageData(action.payload.messages)
      });
    // case UNSELECT_TRIP:
    //   return Object.assign({}, state, {
    //     selectedTrip: null
    //   });
    case LOG_IN:
      return Object.assign({}, state, {
        loggedIn: action.payload
      });
    case LOG_OUT:
      return Object.assign({}, state, {
        cities: null,
        loggedIn: null,
        profile: null,
        currentTrips: null,
        messages: null,
        selectedTrip: null,
        selectedPossCon: null,
        selectedConnection: null,
        countries: null,
        currentCountry: null,
        curentCity: null,
        currentCities: null,
        tripAdded: false,
        newUser: true,
        sortedMessageData: null
      });
    case GRAB_EVERYTHING:
      return Object.assign({}, state, {
        cities: action.payload.cities,
        profile: action.payload.profile,
        currentTrips: action.payload.upcomingTrips || [],
        messages: action.payload.messages || [],
        sortedMessageData: sortMessageData(action.payload.messages),
        selectedTrip: null,
        selectedPossCon: null,
        selectedConnection: null,
      });
    default:
      return state;
  }
};

export default rootReducer;
