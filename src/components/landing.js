import React, { Component } from "react";
import Nav from "./navBar";

export default class Landing extends Component {
  render() {
    return (
      <div>
        <Nav />
        <div className="landingContainer">
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
