import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import axios from "axios";
import { LOG_IN } from "../actions/actions.js";

class Landing extends Component {
  render() {
    const responseGoogle = response => {
      sessionStorage.setItem("banana", response.profileObj.givenName);
      this.props.saveGoogleId(response.googleId); //response.googleId
    };

    const failure = response => {
      console.log("failing, ", response);
    };
    return this.props.loggedIn ? (
      <Redirect to="/main" />
    ) : (
      <div>
        {/* // conditionially render redirect 'if statement' */}
        <div className="landingContainer">
          <GoogleLogin
            clientId="602387760234-beo1e7542ieb47m24do30g4ick9bp9kl.apps.googleusercontent.com"
            buttonText="Login / Signup"
            onSuccess={responseGoogle}
            onFailure={failure}
          />

          <p className="landingPar">
            Are you taking a trip anytime soon? If so, where will you be
            traveling? Plan your trip ahead and meet some great people with
            similar interests
          </p>
          <img
            className="travelingImg"
            src="https://storage.googleapis.com/twg-content/images/mobile-influence-travel-decision-making-hero-.width-1200.jpg"
          />
        </div>
        >
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    saveGoogleId: googleId => {
      dispatch({ type: LOG_IN, payload: googleId });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
