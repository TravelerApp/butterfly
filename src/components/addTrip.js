import React from "react";
import Nav from "./navBar.js";
import data from "../../data.js";
import AddTripForm from "./addTripForm.js";
import { connect } from "react-redux";
import {
  ADD_TRIP,
  GRAB_COUNTRIES,
  SELECT_COUNTRY,
  SELECT_CITIES,
  TOGGLE_ADDED
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
    let uniqueCountries = [];
    data.data.forEach(element => {
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

  renderCities(countryName) {
    console.log("tick", countryName);
    let allCities = [];
    data.data.forEach(element => {
      if (element.country === countryName) {
        allCities.push(element.city);
      }
    });
    //this.setState({ currentCities: allCities });
    console.log(allCities, "<---cities");
    this.props.selectCitiesAction(allCities);
  }
  handleAddToMyTripsClick() {
    console.log(this.props, "clicked!");
    //this.setState({ tripAdded: true });
    this.props.toggleTripAddedAction(true);
  }
  handleSaveTripClick(value) {
    console.log(value, "<---saving this as a trip");
    //save trip to DB .then()
  }
  render() {
    return this.props.tripAdded ? (
      <div>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        <AddTripForm handleClick={this.handleSaveTripClick.bind(this)} />
      </div>
    ) : (
      <div>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        <form>
          <select onChange={this.countrySelected.bind(this)}>
            <option>{this.props.currentCountry}</option>
            {this.props.countries.map((country, i) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select>
            {this.props.currentCities.map((city, i) => (
              <option key={i}>{city}</option>
            ))}
          </select>
          <input
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
    cities: state.cities,
    currentTrips: state.currentTrips,
    countries: state.countries,
    currentCities: state.currentCities,
    currentCountry: state.currentCountry,
    tripAdded: state.tripAdded
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
