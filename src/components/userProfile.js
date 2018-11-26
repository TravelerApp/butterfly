import React from "react";
import ProfileBox from './profileBox.js';

const UserProfile = props => {
  return props.data ? (
    <div>
      <ProfileBox profile={props.data.connectionProfile} />
      <button onClick={() => props.handleClick(props.data)}>
        Make Connection
      </button>{" "}
      {/*pass down func onClick, send out all the deets in a payload */}
    </div>
  ) : (
    <div>
      <h5>Select A Possible Connection To View Their Profile!</h5>
    </div>
  );
};

export default UserProfile;
