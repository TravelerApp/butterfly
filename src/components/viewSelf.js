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
        <div>Your Profile: {this.props.profile.name}</div>
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
