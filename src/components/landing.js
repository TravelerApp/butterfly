import React, { Component } from "react";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import axios from "axios";
import { LOG_IN } from "../actions/actions.js";

class Landing extends Component {
  render() {
    const responseGoogle = response => {
      this.props.saveGoogleId(response.googleId);
      axios
        .post("/addUser", {
          auth_id: response.googleId
        })
        .then(res => {
          console.log(res, " res..");
        })
        .catch(err => {
          console.log("Error: ", err);
        });
      console.log(response);
    };

    const failure = response => {
      alert("Refresh Page");
    };
    return (
      <div>
        {/* // conditionially render redirect 'if statement' */}
        <div className="landingContainer">
          <Link to="/main">Login / Signup</Link>
          <GoogleLogin
            clientId="113602967153-tol5bh2efbf4cgqqqcodmj138s1plh8d.apps.googleusercontent.com"
            buttonText="LOGn"
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
