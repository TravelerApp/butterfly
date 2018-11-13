import React from "react";
import Nav from "./navBar.js";
import data from "../../data.js";
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCountries: [],
      currentCountry: "select a country",
      currentCities: ["select a country to see cities"]
    };
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
    data.forEach(element => {
      if (element.country === countryName) {
        allCities.push(element.city);
      }
    });
    this.setState({ currentCities: allCities });
  }
  render() {
    return (
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
          <input type="text" />
          <input type="submit" />
          <div className="mapbox">MapBOX</div>
        </form>
      </div>
    );
  }
}

export default Add;
