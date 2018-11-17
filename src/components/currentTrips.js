import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";
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
  handleTripClick(value) {
    console.log("redux", value);
    // this.setState({
    //   selected: value
    // });
    this.props.selectTripAction(value);
  }
  handlePossConClick(value) {
    console.log(value, "clicked user");
    this.props.selectPossConAction(value);
  }

  render() {
    return this.props.selectedTrip ? (
      <div>
        <Nav />
        <h3>{this.props.selectedTrip}trip, user profile</h3>
        <button onClick={() => this.handleTripClick(null)}>Go Back</button>
        <SelProfile />
        {/* map out possible connections */}
        <h3>Potential Connections</h3>
        <Poss handleClick={this.handlePossConClick.bind(this)} />
      </div>
    ) : (
      <div>
        <Nav />
        <h3>This is The Current Trips Page</h3>
        <Trip click={this.handleTripClick.bind(this)} />

        {/* map out trips trip = {trip} */}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    currentTrips: state.currentTrips,
    selectedTrip: state.selectedTrip,
    selectedPossCon: state.selectedPossCon
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
