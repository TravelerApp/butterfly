import React from "react";
import { Link } from "react-router-dom";

const Nav = props => (
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
          <Link className="navbar-brand" to="/create">
            profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="navbar-brand" to="/">
            Logout
          </Link>
        </li>
        <li className="nav-item">
          <Link className="navbar-brand" to="/">
            Login
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);
export default Nav;
