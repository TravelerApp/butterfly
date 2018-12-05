import React from "react";
import axios from "axios";
import Nav from "./navBar.js";
import data from "../../data.js";
import AddTripForm from "./addTripForm.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  ADD_TRIP,
  GRAB_COUNTRIES,
  SELECT_COUNTRY,
  SELECT_CITIES,
  TOGGLE_ADDED,
  SELECT_CITY
} from "../actions/actions.js";
// import Map from "../components/map.js";

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddToMyTripsClick = this.handleAddToMyTripsClick.bind(this);
    this.renderCities = this.renderCities.bind(this);
    this.countrySelected = this.countrySelected.bind(this);
  }
  componentDidMount() {
    //console.log(this.props, "PROPS ON ADD MOUNT");
    //setInterval(() => {console.log('calledDidMountfunction for getting messages')}, 3000);
    let uniqueCountries = [];
    this.props.cities.forEach(element => {
      if (!uniqueCountries.includes(element.country)) {
        uniqueCountries.push(element.country);
      }
    });
    this.props.grabCountriesAction(uniqueCountries);
  }

  countrySelected(e) {
    this.props.selectCountryAction(e.target.value);
    setTimeout(() => {
      this.renderCities(this.props.currentCountry);
    }, 100);
  }
  citySelected(e) {
    this.props.selectCityAction(e.target.value);
  }

  renderCities(countryName) {
    let allCities = [];
    // where is this coming from???!?!
    console.log(data);
    data.data.forEach(element => {
      if (element.country === countryName) {
        allCities.push(element);
      }
    });
    this.props.selectCitiesAction(allCities);
    this.props.selectCityAction(allCities[0].city);
  }

  handleAddToMyTripsClick() {
    this.props.toggleTripAddedAction(true);
  }
  handleSaveTripClick(value) {
    let indexOfCity;
    this.props.cities.forEach(element => {
      if (element.city === this.props.currentCity) {
        indexOfCity = element.city_id;
      }
    });
    axios
      .post("/trip", {
        trip_user: this.props.loggedIn,
        trip_city: indexOfCity,
        trip_start: value.start,
        trip_end: value.end,
        purpose: value.reason
      })
      .then(res => {
        console.log("after request", res.data);
        this.props.addTripAction(res.data);
        this.props.toggleTripAddedAction(false);
        this.props.selectCountryAction('select a country');
        this.props.selectCitiesAction(["select a country to see cities"]);
        //need to redirect to upcoming trips
        this.props.history.push('/next');
      })
      .catch(err => {
        console.log("error in save trip request", err);
      });
  }

  render() {
    return this.props.tripAdded ? (
      <div>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        {/* ADD selected city to store for reference in this component */}
        {/* <span>Details for your trip to {this.props.current}</span> */}
        <AddTripForm handleClick={this.handleSaveTripClick.bind(this)} />
      </div>
    ) : (
      <div>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        <form>
          <select
            className="styled-select blue semi-square"
            onChange={this.countrySelected.bind(this)}
          >
            <option>{this.props.currentCountry}</option>
            {this.props.countries.map((country, i) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            className="styled-select blue semi-square"
            onChange={this.citySelected.bind(this)}
          >
            {this.props.currentCities.map((city, i) => (
              <option key={i}>{city.city}</option>
            ))}
          </select>
          <input
            className="actionButton"
            type="button"
            value="Add to my trips"
            onClick={() => this.handleAddToMyTripsClick()}
          />
        </form>
        {/* <div className="mapWindow">
          <Map />
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    cities: state.cities,
    currentTrips: state.currentTrips,
    countries: state.countries,
    currentCities: state.currentCities,
    currentCountry: state.currentCountry,
    tripAdded: state.tripAdded,
    currentCity: state.currentCity,
    newUser: state.newUser
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addTripAction: trip => {
      dispatch({ type: ADD_TRIP, payload: trip });
    },
    grabCountriesAction: countries => {
      dispatch({ type: GRAB_COUNTRIES, payload: countries });
    },
    selectCountryAction: country => {
      dispatch({ type: SELECT_COUNTRY, payload: country });
    },
    selectCitiesAction: cities => {
      dispatch({ type: SELECT_CITIES, payload: cities });
    },
    toggleTripAddedAction: bool => {
      dispatch({ type: TOGGLE_ADDED, payload: bool });
    },
    selectCityAction: city => {
      dispatch({ type: SELECT_CITY, payload: city });
    }
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Add));
