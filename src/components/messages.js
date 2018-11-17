import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import { connect } from "react-redux";
import { SELECT_CON_USER, SEND_MESSAGE } from "../actions/actions.js";

class Mess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sender: "Abdullah Alabasi",
      text: "",
      picture:
        "https://media.licdn.com/dms/image/C4E03AQGqjIkmMliOeg/profile-displayphoto-shrink_200_200/0?e=1547683200&v=beta&t=h6jgkQL1djAVlNSctWQ5Cv3t1EHdNXYpuPIM4Cih0-k",
      messages: []
    };
    this.send = this.send.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  send() {
    this.setState(() =>
      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          { sender: this.state.sender, text: this.state.text }
        ]
      }))
    );
    console.log(this.state.messages);
  }
  onChange(e) {
    this.setState({ text: e.target.value });
  }
  render() {
    return (
      <div>
        <Nav />
        <div>
          <div className="chatWindowDiv">
            <ul className="chatbox">
              {this.state.messages.map(message => (
                <li className="message">
                  <div>
                    <img src={this.state.picture} className="chatPicture" />
                    <p className="senderName">{message.sender}: </p>
                    <p className="messageText">{message.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="chatFormDiv">
            <input
              type="text"
              className="chatTextBox"
              id="chatTextBox"
              onChange={this.onChange.bind(this)}
            />
            <input
              type="button"
              value="Send"
              className="chatSendButton"
              onClick={() => this.send()}
            />
          </div>
        </div>
        {/* <Connected /> */}
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
