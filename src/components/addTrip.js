import React from "react";
import Nav from "./navBar.js";
import data from "../../data.js";
import AddTripForm from "./addTripForm.js";
// import Map from "../components/map.js";

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCountries: [],
      currentCountry: "select a country",
      currentCities: ["select a country to see cities"],
      tripAdded: false
    };
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
    this.setState({ allCountries: uniqueCountries });
  }

  countrySelected(e) {
    this.setState({ currentCountry: e.target.value }, () => {
      this.renderCities(this.state.currentCountry);
    });
  }

  renderCities(countryName) {
    let allCities = [];
    data.data.forEach(element => {
      if (element.country === countryName) {
        allCities.push(element.city);
      }
    });
    this.setState({ currentCities: allCities });
  }
  handleAddToMyTripsClick() {
    this.setState({ tripAdded: true });
  }
  render() {
    return this.state.tripAdded ? (
      <div>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        <AddTripForm />
      </div>
    ) : (
      <div>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        <form>
          <select onChange={this.countrySelected.bind(this)}>
            <option>{this.state.currentCountry}</option>
            {this.state.allCountries.map((country, i) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select>
            {this.state.currentCities.map((city, i) => (
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

export default Add;