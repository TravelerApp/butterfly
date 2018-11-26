import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import { connect } from "react-redux";
import { SELECT_CON_USER, SEND_MESSAGE } from "../actions/actions.js";

// get rid of state
// change hardcoded connected users to collection of OTHERUSERS from messages objects
// those profiles are clickable - if clicked, render profile information
// Reuse POSS and USERPROFILE componenets if possbiel
// messages rendering kosher?
// write final save new message route to DB.

class Mess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // sender: "Abdullah Alabasi",
      // text: "",
      // picture:
      //   "https://media.licdn.com/dms/image/C4E03AQGqjIkmMliOeg/profile-displayphoto-shrink_200_200/0?e=1547683200&v=beta&t=h6jgkQL1djAVlNSctWQ5Cv3t1EHdNXYpuPIM4Cih0-k",
      // messages: []
    };

    //this.send = this.send.bind(this);
    //this.onChange = this.onChange.bind(this);
    //this._handleKeyPress = this._handleKeyPress.bind(this);
  }
  componentDidMount() {
    console.log(this.props);
  }
  // handleClick(value) {}
  // send() {
  //   // {
  //   //   chat_id: chat_id,
  //   //   message: {
  //   //     author: "[authID]",
  //   //     text: '.....',
  //   //     timestamp: Date
  //   //   }
  //   // }

  //   this.setState(() =>
  //     this.setState(prevState => ({
  //       messages: [
  //         ...prevState.messages,
  //         { sender: this.state.sender, text: this.state.text }
  //       ]
  //     }))
  //   );
  // }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.send();
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    e.target.reset();
  }

  componentDidUpdate() {
    var el = this.refs.wrap;
    el.scrollTop = el.scrollHeight;
  }

  handleConnectionClick(message) {
    console.log('connection clicked in messages tab!', message);
    this.props.selectConUserAction(message);
  }


  render() {
    return (
      <div>
        <Nav />
        <div className="containerDiv">
            <div className="chatWindowDiv" ref="wrap">
              <ul className="chatbox">
                {this.props.messages[0].chat.messages.messages.map(
                  (message, i) => (
                    <li
                      key={i}
                      className={
                        this.props.profile.auth_id === message.author
                          ? "senderMessage"
                          : "receiverMessage"
                      }
                    >
                      <img
                        src={
                          this.props.profile.auth_id === message.author
                            ? this.props.profile.picture
                            : this.props.messages[0].otheruser.picture
                        }
                        className="chatPicture"
                      />
                      <p className="senderName">
                        {this.props.profile.auth_id !== message.author
                          ? this.props.messages[0].otheruser.username
                          : this.props.profile.username}
                        :{" "}
                      </p>
                      <p
                        className={
                          this.props.profile.auth_id === message.author
                            ? "receiverMessageText"
                            : "senderMessageText"
                        }
                      >
                        {message.text}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="chatFormDiv">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <input
                  type="text"
                  className="chatTextBox"
                  id="chatTextBox"
                  onKeyPress={this._handleKeyPress.bind(this)}
                  onChange={this.onChange.bind(this)}
                  autocomplete="off"
                />
                <input
                  type="button"
                  value="Send"
                  className="chatSendButton"
                  onClick={() => this.send()}
                />
              </form>
            </div>
          </div>
          <div className="connectionsDiv">
              <h3>Connections:</h3>
              <ul>
                {this.props.messages.map((message, i) =>
                  <li
                    key={i}
                    onClick={this.handleConnectionClick.bind(this, message)}
                  >
                  {message.otheruser.username}....will add city here once included in initial message
                  </li>)}
              </ul>
            </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages,
    profile: state.profile,
    loggedIn: state.loggedIn,
    selectedConUser: state.selectedConUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectConUserAction: connection => {
      dispatch({ type: SELECT_CON_USER, payload: connection });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mess);
