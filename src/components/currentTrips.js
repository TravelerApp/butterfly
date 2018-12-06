import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";
import axios from "axios";
import ProfileBox from './profileBox.js';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import {
  SELECT_TRIP,
  SELECT_POSS_CON,
  UPDATE_MESSAGES,
  UPDATE_BLOCK,
  SELECT_CONNECTION,
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
    if (this.props.selectedConnection && this.props.selectedConnection.otheruser.auth_id === toBlock) {
      this.props.selectConUserAction(null);
    }
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

    return this.props.currentTrips ? this.props.selectedTrip ? (
      <div id ='topContainer'>
        <Nav />
        <div id='selectedTripContainer'>
          <div id='sidebar'>
            <div id='selectedTripHead'>
              <span>Your Trip to: {this.props.cities[this.props.selectedTrip.details.trip_city - 1].city}</span>
              <button onClick={() => this.handleTripClick(null)}>Go Back</button>
            </div>
            <ul id='possibleConnectionsList'>
            {connectionsToRender
              .map((possCon, i) => (
                <li
                  className="connectionsListItem"
                  key={i}
                  onClick={() => {this.handlePossConClick(possCon)}}
                >
                  <img className="connectionsListPicture" src={possCon.connectionProfile.picture}/>
                  <span className="connectionsListName">{possCon.connectionProfile.username}</span>
                  <span className="connectionsListCity">{possCon.connectionProfile.user_country}</span>
                  <span className="connectionBreak" />
                </li>))}
              </ul>
          </div>
          {this.props.selectedPossCon ?
          (<div id='selectedPossibleConnectionBox'>
                {/* ADD THESE to CSS RULESET ONCE CSS IS UPDATED */}
            <div id='selectedPossibleConnectionButtons'>
              <div id='possibleButtonsContainer'>
                <span className='selectPossibleConnectionButton button' onClick={() => this.handleConnectButton(this.props.selectedPossCon)}>Connect</span>
                <span className='selectPossibleConnectionButton button' onClick={() => this.handleBlock(this.props.selectedPossCon.connectionProfile.auth_id)}>No Thanks</span>
              </div>
            </div>
            <ProfileBox profile={this.props.selectedPossCon.connectionProfile} />
             {/* ADD THESE to CSS RULESET ONCE CSS IS UPDATED */}
            <div id='selectedConnectionPurpose'>{this.props.selectedPossCon.connectionTrip.purpose}</div>
            </div>) : connectionsToRender.length ?
            (<div id='selectedPossibleConnectionBox'>
              <div id='noPossibleConnectionSelected'> Select a possible connection to view their profile and reach out</div>
            </div>
            ) :
            (<div id='selectedPossibleConnectionBox'>
              <div id='noPossibleConnectionSelected'> 'No connections found for your upcoming trip</div>
            </div>
            )}
        </div>
      </div>) : this.props.currentTrips.length ?
      (<div id='topContainer'>
        <Nav />
        <div id='upcomingTripsContainer'>
          <div id='upcomingTripsTitle'>
            Find Other People to Meet Up With on the Your Trips!
          </div>
          <div id='upcomingTripsList'>
            {this.props.currentTrips.map((trip, i) => (
              <Trip
                trip={trip}
                city={this.props.cities[trip.details.trip_city - 1].city}
                country={this.props.cities[trip.details.trip_city - 1].country}
                key={i}
                handleClick={this.handleTripClick}
              />
            ))}
          </div>
        </div>
      </div>
    ) : (
    <div id='topContainer'>
      <Nav />
      <div id='noTripsContainer'>
        <div id='upcomingTripsTitle'>
          Submit trip information to find like-minded travellers!
        </div>
        <div id='noTripsButton' className='button' onClick={()=>{console.log('trying to push history'); this.props.history.push('/add')}}>Add a Trip</div>
      </div>
    </div>
    ) : 'loading';
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
    sortedMessageData: state.sortedMessageData,
    selectedConnection: state.selectedConnection
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
    },
    selectConUserAction: connection => {
      dispatch({ type: SELECT_CONNECTION, payload: connection });
    }
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Next));