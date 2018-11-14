import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class Landing extends Component {
  render() {
    return (
      <div>
        <div className="landingContainer">
        <Link to = "/main">Login / Signup</Link>
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
