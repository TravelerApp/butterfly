import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

const Nav = props => {
  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      auth2.disconnect().then(window.location.reload());
    });
  };
  return (
    <div className="nav-div">
      <Link className="nav-link" to="/add">
        Add Trip
      </Link>
      <Link className="nav-link" to="/next">
        Upcoming Trips
      </Link>
      <Link className="nav-link" to="/mess">
        Messages
      </Link>
      <Link className="nav-link" to="/viewprofile">
        Profile
      </Link>
      <span onClick={handleLogout}>LOGOUT</span>
      {/* <GoogleLogout onLogoutSuccess={handleLogout} /> */}
    </div>
  );
};
export default Nav;
