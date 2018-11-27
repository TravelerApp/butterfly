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
      this.props.saveGoogleId(4);
    };

    const failure = response => {
      console.log("failing, ", response);
    };
    return this.props.loggedIn ? (
      <Redirect to="/main" />
    ) : (
      <div>
        <ul class="cb-slideshow">
          <li>
            <span>Image 01</span>
            <div>
              <h3>Travel</h3>
            </div>
          </li>
          <li>
            <span>Image 02</span>
            <div>
              <h3>Explore The World</h3>
            </div>
          </li>
          <li>
            <span>Image 03</span>
            <div>
              <h3>Make new friends</h3>
            </div>
          </li>
          <li>
            <span>Image 04</span>
            <div>
              <h3>Make unforgettable memories</h3>
            </div>
          </li>
          <li>
            <span>Image 05</span>
            <div>
              <h3>Find people with same interests</h3>
            </div>
          </li>
          <li>
            <span>Image 06</span>
            <div>
              <h3>Live the adventure</h3>
            </div>
          </li>
        </ul>

        <div class="container">
          <div class="codrops-top">
            <a>
              <p>THE TRAVELER APP</p>
            </a>
            <span class="right">
              <GoogleLogin
                className="login"
                clientId="602387760234-beo1e7542ieb47m24do30g4ick9bp9kl.apps.googleusercontent.com"
                buttonText="Login / Signup"
                onSuccess={responseGoogle}
                onFailure={failure}
              />
            </span>
            <div class="clr" />
          </div>
          <header />
        </div>
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
