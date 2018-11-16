import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import { connect } from "react-redux";
import { SELECT_CON_USER, SEND_MESSAGE } from "../actions/actions.js";

class Mess extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Nav />
        <h3>This is The Messages Page</h3>
        <Connected />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages,
    profile: state.profile,
    selectedConUser: state.selectedConUser
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mess);
