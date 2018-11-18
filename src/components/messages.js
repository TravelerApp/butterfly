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
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }
  componentDidMount(){
    console.log(this.props);
  }
  handleClick(value){
    
  }
  send() {
    // {
    //   chat_id: chat_id,
    //   message: {
    //     author: "[authID]",
    //     text: '.....',
    //     timestamp: Date
    //   }
    // } 

    this.setState(() =>
      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          { sender: this.state.sender, text: this.state.text }
        ]
      }))
    );
  }
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
  render() {
    return (
      <div>
        <Nav />
        <div className="containerDiv">
          <div>
            <div className="chatWindowDiv" ref="wrap">
              <ul className="chatbox">
                {this.state.messages.map((message, i) => (
                  <li
                    className={
                      i % 2 === 0 ? "senderMessage" : "receiverMessage"
                    }
                  >
                    <div>
                      <img src={this.state.picture} className="chatPicture" />
                      <p className="senderName">{message.sender}: </p>
                      <p
                        className={
                          i % 2 === 0
                            ? "senderMessageText"
                            : "receiverMessageText"
                        }
                      >
                        {message.text}
                      </p>
                    </div>
                  </li>
                ))}
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
            <h3>your connections :</h3>
            <ul>
              <li>James</li>
              <li>Chris</li>
              <li>Alberto</li>
            </ul>
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
    loggedIn: state.loggedIn,
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
