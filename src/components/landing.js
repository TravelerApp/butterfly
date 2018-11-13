import React from "react";
import { Link } from "react-router-dom";

const Landing = props => {
  // There will be a login button/AuthZero interface

  return (
    <div>
      <h1>HEY IM THE LANDING PAGE</h1>
      <Link to="/main">Login/Signup</Link>
    </div>
  );
};

export default Landing;
