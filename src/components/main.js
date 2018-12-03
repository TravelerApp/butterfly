import React from "react";
import Nav from "./navBar.js";
import { connect } from "react-redux";
import { GRAB_EVERYTHING, NEW_USER } from "../actions/actions.js";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    //console.log(this.props, "props on main mount");
  }
  render() {
    return this.props.profile.username ? (
      <Redirect to="/add" />
    ) : (
      <Redirect to="/create" />
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    cities: state.cities,
    profile: state.profile,
    currentTrips: state.currentTrips,
    messages: state.messages,
    newUser: state.newUser
  };
};
const mapDispatchToProps = dispatch => {
  return {
    grabEverythingAction: goodies => {
      dispatch({ type: GRAB_EVERYTHING, payload: goodies });
    },
    newUserAction: bool => {
      dispatch({ type: NEW_USER, payload: bool });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
//doodoodeedoo
