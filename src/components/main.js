import React from "react";
import Nav from "./navBar.js";
import { connect } from "react-redux";
import { GRAB_EVERYTHING } from "../actions/actions.js";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props, "props on main mount");
    // make axios call to insert loggedIn id to database
    // if insertion was successful, redirect to /createprofile
    // otherwise/if error code = 23505, then make initial axios call below
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
  }

  render() {
    return this.props.profile ? (
      <Redirect to="/add" />
    ) : (
      <div>
        <Nav />
        <div>PLEASE WAIT AS WE LOAD YOUR INFORMATION!</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    cities: state.cities,
    profile: state.profile,
    currentTrips: state.currentTrips,
    messages: state.messages
  };
};
const mapDispatchToProps = dispatch => {
  return {
    grabEverythingAction: goodies => {
      dispatch({ type: GRAB_EVERYTHING, payload: goodies });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
