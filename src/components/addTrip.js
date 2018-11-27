import React from "react";
import axios from "axios";
import Nav from "./navBar.js";
import data from "../../data.js";
import AddTripForm from "./addTripForm.js";
import { Redirect } from "react-router-dom";
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
    // this.state = {
    //   allCountries: [],
    //   currentCountry: "select a country",
    //   currentCities: ["select a country to see cities"],
    //   tripAdded: false
    //};
    this.handleAddToMyTripsClick = this.handleAddToMyTripsClick.bind(this);
    this.renderCities = this.renderCities.bind(this);
    this.countrySelected = this.countrySelected.bind(this);
  }
  componentDidMount() {
    console.log(this.props, "PROPS ON ADD MOUNT");
    let uniqueCountries = [];
    // change this to use cities from store ************************
    this.props.cities.forEach(element => {
      if (!uniqueCountries.includes(element.country)) {
        uniqueCountries.push(element.country);
      }
    });
    //this.setState({ allCountries: uniqueCountries });
    this.props.grabCountriesAction(uniqueCountries);
  }

  countrySelected(e) {
    // this.setState({ currentCountry: e.target.value }, () => {
    //   this.renderCities(this.state.currentCountry);
    // });
    this.props.selectCountryAction(e.target.value);
    setTimeout(() => {
      console.log(this.props.currentCountry, "delayed");
      this.renderCities(this.props.currentCountry);
    }, 100); //on state/props did update?
  }
  citySelected(e) {
    console.log(e.target.value, "<--see me?");
    this.props.selectCityAction(e.target.value);
  }

  renderCities(countryName) {
    console.log("tick", countryName);
    let allCities = [];
    data.data.forEach(element => {
      if (element.country === countryName) {
        allCities.push(element);
      }
    });
    //this.setState({ currentCities: allCities });
    console.log(allCities, "<---cities");
    this.props.selectCitiesAction(allCities);
    this.props.selectCityAction(allCities[0].city);
  }
  handleAddToMyTripsClick() {
    console.log("adding to trips");
    console.log(this.props, "clicked!");

    //this.setState({ tripAdded: true });

    //this.props.selectCityAction(document.getElementById("reason").value);
    this.props.toggleTripAddedAction(true);
  }
  handleSaveTripClick(value) {
    console.log(this.props, "props here");
    let indexOfCity;
    this.props.cities.forEach(element => {
      if (element.city === this.props.currentCity) {
        indexOfCity = element.city_id;
      }
    });
    console.log(indexOfCity, "<--- success?");
    value.Destination = this.props.currentCity;
    axios
      .post("/trip", {
        trip_user: this.props.loggedIn,
        trip_city: indexOfCity,
        trip_start: value.Start,
        trip_end: value.End,
        purpose: value.Reason
      })
      .then(res => {
        console.log("after request", res.data);
        this.props.addTripAction(res.data);
        this.props.toggleTripAddedAction(false);

        //addtrip action, update state, redirect to upcoming trips
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
