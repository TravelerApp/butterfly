import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";
import Poss from "./possibleConnections.js";
import SelProfile from "./userProfile.js";

class Next extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }
  handleTripClick(value) {
    console.log("handling click", value);
    this.setState({
      selected: value
    });
  }

  render() {
    return this.state.selected ? (
      <div>
        <Nav />
        <h3>{this.state.selected}trip, user profile</h3>
        <button onClick={() => this.handleTripClick(null)}>Go Back</button>
        <SelProfile />
        {/* map out possible connections */}
        <h3>Potential Connections</h3>
        <Poss />
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
export default Next;
