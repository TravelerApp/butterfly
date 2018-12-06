import React from "react";
const ProfileBox = ({ profile }) => {
let interests = Object.keys(profile.interests).filter(
    key => profile.interests[key]
  );

  return profile === null ? (
    ""
  ) : (
    <div id="profileBox">
      <img src={profile.picture} />
      <div id="profileBoxInfo">
        <div>
          <span>Name:  </span>
          {profile.username}{" "}
        </div>
        <div>
          <span>From:  </span>
          {profile.user_country}
        </div>
        <div>
          <span>Language:  </span> {profile.primary_lang}
        </div>
      </div>
      <div id="profileBoxInterests">
        <div>Interests:
        {interests.map(interest => (
          <span>{interest}</span>
        ))}
        </div>
      </div>
    </div>
  );
};
export default ProfileBox;