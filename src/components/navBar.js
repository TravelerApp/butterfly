import React from "react";
import { Link } from "react-router-dom";

const Nav = props => (
  <span>
    <Link to="/add">Add Trip{"      "}</Link>
    <Link to="/next">Upcoming Trips{"      "}</Link>
    <Link to="/mess">Messages{"      "}</Link>
    <Link to="/">Logout{"      "}</Link>
  </span>
);
export default Nav;
