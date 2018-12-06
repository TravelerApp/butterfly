import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

const Nav = props => {
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      auth2.disconnect().then(window.location.reload());
    });
  };
  return (
    <div className= 'nav'>
      <img className='logo' src='https://images.vexels.com/media/users/3/135535/isolated/preview/b79e409078ebfbc02e8615b2ed5938c6-butterfly-icon-by-vexels.png'/>
      <div className="nav-links">
        <Link className="nav-link" to="/add">
          ADD A TRIP
        </Link>
        <Link className="nav-link" to="/next">
          UPCOMING TRIPS
        </Link>
        <Link className="nav-link" to="/mess">
          MESSAGES
        </Link>
        {/* <Link className="nav-link" to="/viewprofile">
          Profile
        </Link> */}
        <span className='nav-link' onClick={handleLogout}>LOGOUT</span>
      </div>
      {/* <GoogleLogout className='logout' onLogoutSuccess={handleLogout} /> */}
    </div>
  );
};
export default Nav;