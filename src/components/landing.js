import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import axios from "axios";
import { LOG_IN, GRAB_EVERYTHING } from "../actions/actions.js";

class Landing extends Component {
  render() {
    const responseGoogle = response => {
      sessionStorage.setItem("banana", response.profileObj.givenName);
      this.props.saveGoogleId(response.googleId); //response.googleId
      axios
        .post("/user", { auth_id: response.googleId })
        .then(results => {
          console.log("success!");
          console.log(this.props);
          console.log(results, "results from new user request");
        })
        .catch(err => {
          console.log("User Exists!", err);
        });
      axios
        .get(`/initial/${this.props.loggedIn}`)
        .then(res => {
          console.log(res.data, " res..");
          setTimeout(() => {
            this.props.grabEverythingAction(res.data);
          }, 1000);
          setTimeout(() => {
            console.log(this.props, "props after request");
          }, 2500);
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    };

    const failure = response => {
      console.log("failing, ", response);
    };
    return this.props.profile ? (
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
    loggedIn: state.loggedIn,
    profile: state.profile
  };
};
const mapDispatchToProps = dispatch => {
  return {
    saveGoogleId: googleId => {
      dispatch({ type: LOG_IN, payload: googleId });
    },
    grabEverythingAction: goodies => {
      dispatch({ type: GRAB_EVERYTHING, payload: goodies });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
