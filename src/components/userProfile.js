import React from "react";
import ProfileBox from './profileBox.js';

const PossConnProfile = props => {
  return (
    <div>
      <ProfileBox profile={props.possCon.connectionProfile} />
      <button onClick={() => props.handleClick(props.possCon)}>
        Make Connection
      </button>
      <button onClick={() => props.handleBlock(props.possCon.connectionProfile.auth_id)}>
        They don't look very fun to meeeeeee
      </button>
    </div>
  );
};

export default PossConnProfile;
