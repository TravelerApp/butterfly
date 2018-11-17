import React from "react";
import Nav from "./navBar.js";
import data from "../../data.js";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { SAVE_PROFILE } from "../actions/actions.js";

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      allCountries: [],
      primaryLanguage: ["Select a language .."],
      interests: [
        { name: "Hiking", checked: false },
        { name: "Night Life", checked: false },
        { name: "Museums and history", checked: false },
        { name: "shopping", checked: false }
      ],
      currentCountry: "Select your origin country .."
    };
    this.interestChanged = this.interestChanged.bind(this);
    this.submit = this.submit.bind(this);
    this.fullNameChanged = this.fullNameChanged.bind(this);
    this.orginCountryChanged = this.orginCountryChanged.bind(this);
    this.primaryLanguageChanged = this.primaryLanguageChanged.bind(this);
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
  fullNameChanged(e) {
    this.setState({ fullName: e.target.value });
  }
  orginCountryChanged(e) {
    this.setState({ originCountry: e.target.value });
  }
  primaryLanguageChanged(e) {
    this.setState({ primaryLanguage: e.target.value });
  }
  interestChanged(name) {
    this.state.interests.forEach(element => {
      if (element.name === name) {
        element.checked = !element.checked;
      }
    });
  }
  submit() {
    console.log(this.state);
    const payload = {
      name: this.state.fullName,
      country: this.state.originCountry,
      language: this.state.primaryLanguage,
      interests: this.state.interests
    };
    this.props.saveProfileAction(payload);
    setTimeout(() => {
      console.log(this.props);
    }, 1000);
  }
  render() {
    return this.props.profile ? (
      <Redirect to="/add" />
    ) : (
      <div>
        <h1>THANK YOU FOR JOINING US!</h1>
        <h1>PLEASE CREATE YOUR PROFILE!</h1>
        <form className="createProfileForm">
          <p>Full name: </p>
          <input
            type="text"
            placeholder="your name here .."
            onChange={this.fullNameChanged}
          />
          <p>Origin country: </p>
          <select onChange={this.orginCountryChanged.bind(this)}>
            <option>{this.state.currentCountry}</option>
            {this.state.allCountries.map((country, i) => (
              <option key={i} value={country.name}>
                {country}
              </option>
            ))}
          </select>
          <p>Primary language: </p>
          <select onChange={this.primaryLanguageChanged.bind(this)}>
            <option>{this.state.primaryLanguage}</option>
            {data.languages.map((language, i) => (
              <option key={i}>{language}</option>
            ))}
          </select>
          <h4> Interests : </h4>
          <div>
            {this.state.interests.map((interest, i) => (
              <div key={i}>
                <p>{interest.name}</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => this.interestChanged(interest.name)}
                  />
                  <span className="slider round" />
                </label>
              </div>
            ))}
          </div>
          <input
            type="button"
            value="Create my profile"
            onClick={() => this.submit()}
          />
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    profile: state.profile,
    countries: state.countries
  };
};
const mapDispatchToProps = dispatch => {
  return {
    saveProfileAction: profile => {
      dispatch({ type: SAVE_PROFILE, payload: profile });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create);
