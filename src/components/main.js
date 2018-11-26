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
    console.log(this.props, "props on main mount");
    axios
      .post("/user", { auth_id: this.props.loggedIn })
      .then(results => {
        console.log("success!");
        //redirect to create here
      })
      .catch(err => {
        console.log("error!", err);
        axios
          .get(`/initial/${this.props.loggedIn}`)
          .then(res => {
            if (!res.profile.username) {
              this.props.newUserAction(true);
            }
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
      });
  }
  render() {
    return this.props.profile.username ? (
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
