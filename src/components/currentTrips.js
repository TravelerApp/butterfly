import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";
import axios from "axios";
import Poss from "./possibleConnections.js";
import PossConnProfile from "./userProfile.js";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import {
  SELECT_TRIP,
  SELECT_POSS_CON,
  UNSELECT_TRIP,
  UPDATE_MESSAGES,
  UPDATE_BLOCK
} from "../actions/actions.js";

class Next extends React.Component {
  constructor(props) {
    super(props);
    this.handleConnectButton = this.handleConnectButton.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handlePossConClick = this.handlePossConClick.bind(this);
    this.handleTripClick = this.handleTripClick.bind(this);
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

  handleConnectButton(connection) {
    console.log('making connection with:', connection)
    console.log("sortedMessageData object:", this.props.sortedMessageData);

    let connectionId = connection.connectionProfile.auth_id;
    let connectionCity = connection.connectionTrip.trip_city;
    let pending = this.props.sortedMessageData.requestReceived;

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
        messages: {messages: []},
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

  handleBlock(toBlock){
    // update connections array in selectedTrip for immediate un-rendering of blocked possconn
    let oldSelectedTripConnections = this.props.selectedTrip.connections.slice();
    let newSelectedTripConnections = oldSelectedTripConnections.filter(possCon => !(possCon.connectionProfile.auth_id === toBlock));
    let newSelectedTrip = Object.assign({}, this.props.selectedTrip, {connections: newSelectedTripConnections})
    this.props.selectTripAction(newSelectedTrip)
    // package data for call to block connection in database
    let user = this.props.loggedIn;
    let userBlocked = this.props.profile.blocked;
    let otheruserBlocked = this.props.selectedPossCon.connectionProfile.blocked;
    this.props.selectPossConAction(null);
    axios.patch('/block', {
      user,
      newUserBlocked: {...userBlocked, [toBlock]: user},
      toBlock,
      newOtheruserBlocked: {...otheruserBlocked, [user]: user}
    })
    .then(updatedTripsAndChats => {
      // update store's messages array - write new action and reducer and import
      console.log(updatedTripsAndChats);
      this.props.updateAfterBlockAction(updatedTripsAndChats.data)
    })
    .catch(err => {
      console.log('error returned from call to block user', err);
    })
  }

  render() {
    const connectionsToRender = this.props.selectedTrip ?
      this.props.selectedTrip.connections.filter(possCon => {
        let testId = possCon.connectionProfile.auth_id;
        let testCity = possCon.connectionTrip.trip_city;
        if (!(testId in this.props.sortedMessageData.active || testId in this.props.sortedMessageData.requestSent)) {
          return true;
        } else {
          if (testId in this.props.sortedMessageData.active && this.props.sortedMessageData.active[testId].includes(testCity)) {
            return false;
          }
          if (testId in this.props.sortedMessageData.requestSent && this.props.sortedMessageData.requestSent[testId].includes(testCity)) {
            return false;
          }
          return true;
        }
      }) : [];

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
        {this.props.selectedPossCon ?
          <PossConnProfile
            possCon={this.props.selectedPossCon}
            handleClick={this.handleConnectButton}
            handleBlock={this.handleBlock}
          />
          : connectionsToRender.length ?
            'select a possible connection to view their profile and reach out'
            : 'no connections found for your upcoming trip :('
        }
        {connectionsToRender.length ?
          <div>
            <h3>Potential Connections</h3>
            {connectionsToRender
            // .filter(possCon => {
            //   let testId = possCon.connectionProfile.auth_id;
            //   let testCity = possCon.connectionTrip.trip_city;
            //   if (!(testId in this.props.sortedMessageData.active || testId in this.props.sortedMessageData.requestSent)) {
            //     return true;
            //   } else {
            //     if (testId in this.props.sortedMessageData.active && this.props.sortedMessageData.active[testId].includes(testCity)) {
            //       return false;
            //     }
            //     if (testId in this.props.sortedMessageData.requestSent && this.props.sortedMessageData.requestSent[testId].includes(testCity)) {
            //       return false;
            //     }
            //     return true;
            //   }
            // })
            .map((possCon, i, filtered) => (
              <Poss
                value={possCon}
                connection={possCon.connectionProfile.username}
                from={possCon.connectionProfile.user_country}
                purpose={possCon.connectionTrip.purpose}
                key={i}
                click={this.handlePossConClick}
              />
            ))}
          </div>
        : ''}
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
            click={this.handleTripClick}
          />
        ))}
      </div>
    ) : (
    <div>
      <Nav />
      Enter trip information to find possible PALS to have FUN with while your TRAVELING
      <button ><Link to="/add">ADD A TRIP</Link></button>
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
    sortedMessageData: state.sortedMessageData
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
    },
    updateAfterBlockAction: updates => {
      dispatch({ type: UPDATE_BLOCK, payload: updates });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Next);
