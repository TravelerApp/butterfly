import React from "react";
import ProfileBox from './profileBox.js';

const UserProfile = props => {
  return props.data ? (
    <ProfileBox profile={props.data.connectionProfile} />
  ) : (
    <div>
      <h5>Select A Possible Connection To View Their Profile!</h5>
    </div>
  );
};

export default UserProfile;
