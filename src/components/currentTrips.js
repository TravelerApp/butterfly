import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";
import axios from "axios";
import Poss from "./possibleConnections.js";
import ConnProfile from "./userProfile.js";
import { connect } from "react-redux";
import {
  SELECT_TRIP,
  SELECT_POSS_CON,
  UNSELECT_TRIP,
  UPDATE_MESSAGES
} from "../actions/actions.js";

class Next extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('currentTrips mounting props:', this.props);
  }

  handleTripClick(value) {
    this.props.selectTripAction(value);
    this.props.selectPossConAction(null);
  }

  handlePossConClick(value) {
    this.props.selectPossConAction(value);
  }


  // -> When (button clicked) to make connection:
	// -> if auth_id(of possibleConnection) is in CONNECTION_STATUSES.connectionRequestReceived
	// 	 -> sets selectedPossCon to null (selectpossconaction)
	// 	 -> call database to update the chat and set CONNECTION:TRUE
	// 		 -> access chat record by finding unique occurrence of user1/user2/city
	// 		 -> update connection:TRUE
	// 	-> query database for allchatsforUser, return them, update the store
	// 		-> updating store's messages AND connection_statues object
	// 	[[[[-> NOTIFY USER THAT THEY CAN NOW MESSAGE THIS PERSON???]]]]
	// 	(This person will now be available in your messages page)
	// -> if they are NOT in CONNECTION_STATUSES.connectionRequestReceived
	// 	-> sets selectedPossCon to null (selectpossconaction)
	// 	-> make axios call to database
	// 		-> check chat table for where you are user2, they are user1, and the city ids match
	// 			-> if that is already there follow the instructions above (take that chat object that was found, turn connection to true, get all chats for user, return, update stores messages and conneciton_status object)
	// 			-> if you don't find this unique occurrence already there
	// 				-> create initial chat object (with NO messages, and boolean CONNECTION:FALSE)
	// 				-> have this call return allChats, update the store
	// 				-> updating store's messages AND connection_statues object

  handleConnectButton(connection) {
    console.log('making connection with:', connection)
    console.log("connectionsstatus object:", this.props.connectionsStatus);

    let connectionId = connection.connectionProfile.auth_id;
    let connectionCity = connection.connectionTrip.trip_city;
    let pending = this.props.connectionsStatus.requestReceived;

    this.props.selectPossConAction(null);

    if (connectionId in pending && pending[connectionId].includes(connectionCity)) {
      axios.patch("/message", {
        action: 'complete connection',
        user1: connectionId,
        user2: this.props.loggedIn,
        chat_city: connectionCity
      })
      .then(allChats => {
        console.log("successful connection attempt made", allChats);
        this.props.updateMessagesAction(allChats.data);
      })
      .catch(err => {
        console.log("error in initial chat request", err);
      });
    } else {
      axios.post("/message", {
        sender: this.props.loggedIn,
        receiver: connectionId,
        messages: {
          messages: []},
        chat_city: connectionCity
      })
      .then(allChats => {
        console.log("successful connection attempt made", allChats);
        this.props.updateMessagesAction(allChats.data);
      })
      .catch(err => {
        console.log("error in initial chat request", err);
      });
    }
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
        <ConnProfile
          data={this.props.selectedPossCon}
          handleClick={this.handleConnectButton.bind(this)}
        />
        <h3>Potential Connections</h3>
        {this.props.selectedTrip.connections
        .filter(possCon => {
          let testId = possCon.connectionProfile.auth_id;
          let testCity = possCon.connectionTrip.trip_city;
          if (!(testId in this.props.connectionsStatus.active || testId in this.props.connectionsStatus.requestSent)) {
            return true;
          } else {
            if (testId in this.props.connectionsStatus.active && this.props.connectionsStatus.active[testId].includes(testCity)) {
              return false;
            }
            if (testId in this.props.connectionsStatus.requestSent && this.props.connectionsStatus.requestSent[testId].includes(testCity)) {
              return false;
            }
            return true;
          }
        })
        .map((possCon, i, filtered) => (
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
    ) : this.props.currentTrips.length ?
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
    ) : (
    <div>
      <Nav />
      Find people heading to the same places you are and then you can chat with them here!
    </div>
    );
  }
}

//---------------------------- REDUX ----------------------------
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
    // unselectTripAction: trip => {
    //   dispatch({ type: UNSELECT_TRIP, payload: trip });
    // },
    updateMessagesAction: messages => {
      dispatch({ type: UPDATE_MESSAGES, payload: messages });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Next);
