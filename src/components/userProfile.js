import React from "react";
import ProfileBox from './profileBox.js';

const ConnProfile = props => {
  return props.data ? (
    <div>
      <ProfileBox profile={props.data.connectionProfile} />
      <button onClick={() => props.handleClick(props.data)}>
        Make Connection
      </button>
      <button onClick={() => this.handleBlock(this.props.selectedConnection.otheruser.auth_id)}>
        They don't look very fun to meeeeeee
      </button>
    </div>
  ) : (
    <div>
      <h5>Select A Possible Connection To View Their Profile!</h5>
    </div>
  );
};

export default ConnProfile;
