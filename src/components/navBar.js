import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

const Nav = props => {
  const handleLogout = () => {
    sessionStorage.clear();
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
      <Link className="nav-link" onClick={() => handleLogout()} to="/">
        Logout
      </Link>
    </div>
  );
};
export default Nav;
