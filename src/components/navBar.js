import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

const Nav = props => {
  const handleLogout = () => {
    sessionStorage.clear();
    console.log("it worked!");
  };
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-4">
      <div className="container">
        <a className="navbar-brand" href="/">
          Traveler App
        </a>
      </div>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="navbar-brand" to="/add">
              Add Trip
            </Link>
          </li>
          <li className="nav-item">
            <Link className="navbar-brand" to="/next">
              Upcoming Trips
            </Link>
          </li>
          <li className="nav-item">
            <Link className="navbar-brand" to="/mess">
              Messages
            </Link>
          </li>
          <li className="nav-item">
            <Link className="navbar-brand" to="/viewprofile">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link
              onClick={() => handleLogout()}
              className="navbar-brand"
              to="/"
            >
              Logout
            </Link>
            {/* <GoogleLogout
              onClick={() => this.handleLogout()}
              buttonText="Logout"
              onLogoutSuccess=
            /> */}
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Nav;
