import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

const Nav = props => {
  const handleLogout = () => {
    sessionStorage.clear();
    console.log("it worked!");
  };
  return (
    <div>
      <ul className="nav-ul">
        <li className="nav-li">
          <a>
            <Link className="navbar-brand" to="/add">
              Add Trip
            </Link>
          </a>
        </li>
        <li className="nav-li">
          <a>
            <Link className="navbar-brand" to="/next">
              Upcoming Trips
            </Link>
          </a>
        </li>
        <li className="nav-li">
          <a>
            <Link className="navbar-brand" to="/mess">
              Messages
            </Link>
          </a>
        </li>
        <li className="nav-li">
          <a>
            <Link className="navbar-brand" to="/viewprofile">
              Profile
            </Link>
          </a>
        </li>
        <li className="nav-li">
          <a>
            <Link
              onClick={() => handleLogout()}
              className="navbar-brand"
              to="/"
            >
              Logout
            </Link>
          </a>

          {/* <GoogleLogout
              onClick={() => this.handleLogout()}
              buttonText="Logout"
              onLogoutSuccess=
            /> */}
        </li>
      </ul>
    </div>
  );
};
export default Nav;
