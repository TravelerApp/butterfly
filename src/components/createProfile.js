import React from "react";
import Nav from "./navBar.js";
import data from "../../data.js";
import axios from "axios";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { SAVE_PROFILE } from "../actions/actions.js";

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPicture: "https://nfsmods.xyz/img/noavatar.png",
      fullName: "",
      allCountries: [],
      primaryLanguage: ["Select a language .."],
      interests: [
        { name: "Tourist Attractions", checked: false },
        { name: "Shopping", checked: false },
        { name: "Historical Sites", checked: false },
        { name: "Museums", checked: false },
        { name: "The Arts", checked: false },
        { name: "Nature", checked: false },
        { name: "Sporting Events", checked: false },
        { name: "Night Life", checked: false },
        { name: "Local Culture", checked: false },
        { name: "Street Food", checked: false },
        { name: "Fine Dining", checked: false },
        { name: "Tours", checked: false }
      ],
      currentCountry: "Select your origin country ..",
      selectedFile: null,
      imageUrl: ""
    };
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
    this.handleselectedFile = this.handleselectedFile.bind(this);
    this.interestChanged = this.interestChanged.bind(this);
    this.submit = this.submit.bind(this);
    this.fullNameChanged = this.fullNameChanged.bind(this);
    this.orginCountryChanged = this.orginCountryChanged.bind(this);
    this.primaryLanguageChanged = this.primaryLanguageChanged.bind(this);
  }
  componentDidMount() {
    console.log(this.props, "<--on create");
    let uniqueCountries = [];
    this.props.cities.forEach(element => {
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
    const formattedInterests = {};
    this.state.interests.forEach(int => {
      formattedInterests[int.name] = int.checked;
    });
    const payload = {
      auth_id: this.props.loggedIn,
      username: this.state.fullName,
      user_country: this.state.originCountry,
      picture: this.state.imageUrl,
      primary_lang: this.state.primaryLanguage,
      interests: formattedInterests
    };
    //save to db
    console.log(payload, "<-- payload here before patch");
    axios
      .patch("/user", payload)
      .then(profile => {
        console.log(profile.data, "<--returned profile");
        this.props.saveProfileAction(profile.data);
      })
      .catch(err => {
        console.log("Error in profile creation: ", err);
      });
  }
  handleselectedFile(event) {
    event.preventDefault();
    this.setState({ selectedFile: event.target.files[0] }, () =>
      this.fileUploadHandler()
    );
  }

  fileUploadHandler(e) {
    console.log("fileUploadHandler was called ..");
    const fd = new FormData();
    fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
    axios.post("http://localhost:3000/image-upload", fd).then(res => {
      this.setState({
        imageUrl: res.data.imageUrl,
        currentPicture: res.data.imageUrl
      });
    });
  }
  render() {
    return this.props.profile.username ? (
      <Redirect to="/add" />
    ) : (
      <div className="jamesCreatePage">
        <div className="jamesInputForm">
          <h1 className="jamesCreateTitle">Tell us about yourself:</h1>
          <form className="createProfileForm">
            <div className="jamesPicBox">
              <img className="jamesPic" src={this.state.currentPicture} />
            </div>
            <div className="JDBOX1">
              <p id="JamesText">Full name: </p>
              <input
                className="jamesNameInput"
                type="text"
                placeholder="your name here .."
                onChange={this.fullNameChanged}
              />

              <h3 id="JamesText">Profile Picture: </h3>
              <input
                className="jamesPicInput"
                type="file"
                onChange={this.handleselectedFile}
              />

              <p id="JamesText">Origin country: </p>
              <select
                className="jamesCountryInput"
                onChange={this.orginCountryChanged.bind(this)}
              >
                <option>{this.state.currentCountry}</option>
                {this.state.allCountries.map((country, i) => (
                  <option key={i} value={country.name}>
                    {country}
                  </option>
                ))}
              </select>
              <p id="JamesText">Primary language: </p>
              <select
                className="jamesLangInput"
                onChange={this.primaryLanguageChanged.bind(this)}
              >
                <option>{this.state.primaryLanguage}</option>
                {data.languages.map((language, i) => (
                  <option key={i}>{language}</option>
                ))}
              </select>
            </div>
            <div className="JDBOX2">
              <h4 id="JamesText1"> Interests: </h4>
              <div className="jamesInterestInput">
                {this.state.interests.map((interest, i) => (
                  <div className="eachInterest" key={i}>
                    <p className="createInterest">{interest.name}</p>
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
            </div>

            <input
              className="JamesCreateButton"
              type="button"
              value="Create my profile"
              onClick={() => this.submit()}
            />
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    profile: state.profile,
    countries: state.countries,
    loggedIn: state.loggedIn,
    cities: state.cities
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
