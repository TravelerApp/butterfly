import React from "react";
import ProfileBox from './profileBox.js';

const ConnProfile = props => {
  return props.data ? (
    <div>
      <ProfileBox profile={props.data.connectionProfile} />
      <button onClick={() => props.handleClick(props.data)}>
        Make Connection
      </button>
    </div>
  ) : (
    <div>
      <h5>Select A Possible Connection To View Their Profile!</h5>
    </div>
  );
};

export default ConnProfile;
