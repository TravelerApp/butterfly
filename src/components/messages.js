import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import ProfileBox from './profileBox.js';
import { connect } from "react-redux";
import { SELECT_CONNECTION, SEND_MESSAGE } from "../actions/actions.js";

// messages rendering kosher?
// write final save new message route to DB.

class Mess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };

    this.send = this.send.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    if (this.props.messages) {
      this.props.selectConUserAction(this.props.messages[0]);
    }
  }

  send() {
    let newMessage = {
      author: this.props.loggedIn,
      text: this.state.text,
      timestamp: Date.now()
    }
    console.log('this is the new message:', newMessage);
    console.log('old messages:', this.props.selectedConnection.chat.messages.messages);
    let chatToUpdate = this.props.selectedConnection.chat;
    chatToUpdate.messages.messages.push(newMessage);
    console.log('new messages:', chatToUpdate);
    console.log('new store:', this.props)
    //this.props.sendMessageAction(newMessage);
    //   chat_id: chat_id,
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.send();
    e.target.reset();
    this.setState({text: ""});
  }

  componentDidUpdate() {
    var el = this.refs.wrap;
    el.scrollTop = el.scrollHeight;
  }

  handleConnectionClick(user) {
    console.log('connection clicked in messages tab!', user);
    this.props.selectConUserAction(user);
    console.log(this.props.selectedConnection);
  }

  render() {
    let connectionProfile = this.props.selectedConnection ?
      (<ProfileBox profile={this.props.selectedConnection.otheruser}/>) : '';

    let chatToRender = this.props.selectedConnection ? this.props.selectedConnection
      : this.props.messages.length ? this.props.messages[0] : null;

    let chatWindow = chatToRender ?
      (<div className="containerDiv">
            <div className="chatWindowDiv" ref="wrap">
              <ul className="chatbox">
                {chatToRender.chat.messages.messages.map(
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
                            : chatToRender.otheruser.picture
                        }
                        className="chatPicture"
                      />
                      <p className="senderName">
                        {this.props.profile.auth_id !== message.author
                          ? chatToRender.otheruser.username
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
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="chatTextBox"
                  id="chatTextBox"
                  // onKeyPress={this._handleKeyPress}
                  onChange={this.onChange}
                  autocomplete="off"
                />
                <input
                  type="submit"
                  value="Send"
                  className="chatSendButton"
                />
              </form>
            </div>
          </div>) :
          (<div>
            Find people heading to the same places you are and then you can chat with them here!
          </div>)


    return (
      <div>
        <Nav />
        {chatWindow}
        {connectionProfile}
        <div className="connectionsDiv">
          <h3>Connections:</h3>
          <ul>
            {this.props.messages.map((message, i) =>
              <li
                key={i}
                onClick={this.handleConnectionClick.bind(this, message)}
              >
                {message.otheruser.username}
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
    selectedConnection: state.selectedConnection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectConUserAction: connection => {
      dispatch({ type: SELECT_CONNECTION, payload: connection });
    },
    sendMessageAction: message => {
      dispatch({ type: SEND_MESSAGE, payload: message});
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mess);
