import React from "react";

const UserProfile = props => {
  return props.data ? (
    <div>
      <div>Name: {props.data.connectionProfile.username}</div>
      <div>From: {props.data.connectionProfile.user_country}</div>
      <div>Language: {props.data.connectionProfile.primary_lang}</div>
      {/* Interests: need to go through interest object, display true elements */}
    </div>
  ) : (
    <div>
      <h5>Select A Possible Connection To View Their Profile!</h5>
    </div>
  );
};

export default UserProfile;
//doodoodeedoo
