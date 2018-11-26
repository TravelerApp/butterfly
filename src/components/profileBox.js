import React from "react";

const ProfileBox = ({profile}) => {
  return (
    <div>
      <div>Name: {profile.username}</div>
      <div>From: {profile.user_country}</div>
      <div>Language: {profile.primary_lang}</div>
      {/* Interests: need to go through interest object, display true elements */}
    </div>
  )
};

export default ProfileBox;

// let interests={hiking: false, tours: false, food: true, museums: false, landmarks: false};
// Object.keys(interests).filter(key=>interests.key);
// take resulting array, map it out ... eventually with icons based on string value