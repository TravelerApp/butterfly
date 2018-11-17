import {
  GRAB_EVERYTHING,
  SAVE_PROFILE,
  ADD_TRIP,
  SELECT_TRIP,
  SELECT_POSS_CON,
  SELECT_CON_USER,
  SEND_MESSAGE,
  UNSELECT_TRIP,
  LOG_OUT,
  GRAB_COUNTRIES,
  SELECT_COUNTRY,
  SELECT_CITIES,
  TOGGLE_ADDED,
  LOG_IN,
  GET_MESSAGES
} from "../actions/actions.js";

const initialState = {
  cities: null,
  loggedIn: null, //user unique id (payload from login return)
  profile: null, // name, picture, country, language, interests
  currentTrips: ["France", "Germany", "Poland"], //array of trips
  messages: null, //array of messages
  selectedTrip: null, // current trip view
  selectedPossCon: null, // possible connections user list
  selectedConUser: null, //list of already connected users
  countries: ["test"], //
  currentCountry: "select a country",
  currentCity: null,
  currentCities: ["select a country to see cities"],
  tripAdded: false
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
    case ADD_TRIP:
      return Object.assign({}, state, {
        currentTrips: action.payload
      });
    case SELECT_TRIP:
      return Object.assign({}, state, {
        selectedTrip: action.payload
      });
    case SELECT_POSS_CON:
      return Object.assign({}, state, {
        selectedPossCon: action.payload
      });
    case SELECT_CON_USER:
      return Object.assign({}, state, {
        selectedConUser: action.payload
      });
    case SEND_MESSAGE:
      return Object.assign({}, state, {
        messages: [...state.messages, action.payload] //needs fixing
      });
    //spread op
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
        selectedTrip: null,
        selectedPossCon: null,
        selectedConUser: null,
        countries: null,
        currentCountry: null,
        currentCities: null
      });
    case GRAB_EVERYTHING:
      return Object.assign({}, state, {
        cities: action.payload.cities,
        profile: action.payload.profile,
        currentTrips: action.payload.upcomingTrips,
        messages: action.payload.messages,
        selectedTrip: null,
        selectedPossCon: null,
        selectedConUser: null
      });
      case GET_MESSAGES:
      console.log("reducer called");
    default:
      return state;
  }
};

export default rootReducer;
