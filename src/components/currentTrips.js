import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";
import axios from "axios";
import Poss from "./possibleConnections.js";
import SelProfile from "./userProfile.js";
import { connect } from "react-redux";
import {
  SELECT_TRIP,
  SELECT_POSS_CON,
  UNSELECT_TRIP
} from "../actions/actions.js";

class Next extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   selected: null
    // };
  }
  componentDidMount() {
    console.log('currentTrips mounting props:', this.props);
  }
  handleTripClick(value) {
    console.log("redux", value);
    // this.setState({
    //   selected: value
    // });
    this.props.selectTripAction(value);
    this.props.selectPossConAction(null);
  }
  handlePossConClick(value) {
    console.log(value, "clicked user");
    this.props.selectPossConAction(value);
  }
  handleConnectButton(value) {
    console.log("Making a Connection with: ", value);
    axios
      .post("/message", {
        sender: this.props.loggedIn,
        receiver: value.connectionProfile.auth_id,
        messages: {
          messages: [
            // {
            //   author: this.props.loggedIn,
            //   text: `Hey there, ${
            //     this.props.profile.username
            //   } would like to connect with you!`,
            //   timestamp: Date.now()
            // }
          ]
        },
        chat_city: value.connectionTrip.trip_city
      })
      .then(chat => {
        console.log("successful initial chat", chat);
      })
      .catch(err => {
        console.log("error in initial chat request", err);
      });
  }

  render() {
    return this.props.selectedTrip ? (
      <div>
        <Nav />
        <h3>
          Your Trip to:{" "}
          {
            this.props.cities[this.props.selectedTrip.details.trip_city - 1]
              .city
          }
        </h3>
        <button onClick={() => this.handleTripClick(null)}>Go Back</button>
        <SelProfile
          data={this.props.selectedPossCon}
          handleClick={this.handleConnectButton.bind(this)}
        />
        <h3>Potential Connections</h3>
        {/*  before mapping out, filter selectedTrip connections for users who are in the connected users array */}
        {this.props.selectedTrip.connections.map((possCon, i) => (
          <Poss
            value={possCon}
            connection={possCon.connectionProfile.username}
            from={possCon.connectionProfile.user_country}
            purpose={possCon.connectionTrip.purpose}
            key={i}
            click={this.handlePossConClick.bind(this)}
          />
        ))}
      </div>
    ) :
    // ADD another ternary here that checks if if there are NO current trips saved (either array is empty or value is null),
    //   -> we display somehting like "add trips to view possible connections"
    (
      <div>
        <Nav />
        <h3>Your Upcoming Trips</h3>
        <h5>CLICK SEE OTHER COOL PEOPLE TRAVELLING TO THE SAME PLACE AT THE SAME TIME!</h5>
        {this.props.currentTrips.map((trip, i) => (
          <Trip
            value={trip}
            trip={this.props.cities[trip.details.trip_city - 1].city}
            country={this.props.cities[trip.details.trip_city - 1].country}
            key={i}
            click={this.handleTripClick.bind(this)}
          />
        ))}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    cities: state.cities,
    currentTrips: state.currentTrips,
    selectedTrip: state.selectedTrip,
    selectedPossCon: state.selectedPossCon,
    loggedIn: state.loggedIn,
    profile: state.profile,
    connectionsStatus: state.connectionsStatus
  };
};
const mapDispatchToProps = dispatch => {
  return {
    selectTripAction: trip => {
      dispatch({ type: SELECT_TRIP, payload: trip });
    },
    selectPossConAction: possCon => {
      dispatch({ type: SELECT_POSS_CON, payload: possCon });
    },
    unselectTripAction: trip => {
      dispatch({ type: UNSELECT_TRIP, payload: trip });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Next);
