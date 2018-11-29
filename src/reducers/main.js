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
  UNSELECT_TRIP,
  LOG_OUT,
  GRAB_COUNTRIES,
  SELECT_COUNTRY,
  SELECT_CITIES,
  TOGGLE_ADDED,
  LOG_IN
} from "../actions/actions.js";

const initialState = {
  cities: null,
  loggedIn: null, //user unique id (payload from login return)
  profile: null, // name, picture, country, language, interests
  currentTrips: [], //array of trips
  messages: null, // array of messages
  // messagesToRender: null, // messages filtered for message length > 1
  selectedTrip: null, // current trip view
  selectedPossCon: null, // possible connections user list
  selectedConnection: null, // this is the connection whose message history you are currently viewing
  countries: ["test"],
  currentCountry: "select a country",
  currentCity: null,
  currentCities: ["select a country to see cities"],
  tripAdded: false,
  newUser: true
};

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
        messages: action.payload
      });
    case UNSELECT_TRIP:
      return Object.assign({}, state, {
        selectedTrip: null
      });
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
        // messagesToRender: null,
        selectedTrip: null,
        selectedPossCon: null,
        selectedConnection: null,
        countries: null,
        currentCountry: null,
        currentCities: null
      });
    case GRAB_EVERYTHING:
      // build up connectedUsers object
      return Object.assign({}, state, {
        cities: action.payload.cities,
        profile: action.payload.profile,
        currentTrips: action.payload.upcomingTrips || [],
        messages: action.payload.messages,
        // connectedUsers: object built above
        selectedTrip: null,
        selectedPossCon: null,
        selectedConnection: null
      });
    default:
      return state;
  }
};

export default rootReducer;
