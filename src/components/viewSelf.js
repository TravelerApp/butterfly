import React from "react";
import Nav from "./navBar.js";
import { connect } from "react-redux";

class Self extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Nav />
        <div>Your Profile: </div>
        <div>Name: {this.props.profile.username}</div>
        <div>Home Country: {this.props.profile.user_country}</div>
        <div>Primary Language: {this.props.profile.primary_lang}</div>
        {/* <div>Your Interests: {this.props.profile.interests}</div> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps)(Self);
