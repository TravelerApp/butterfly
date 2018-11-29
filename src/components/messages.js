import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import ProfileBox from './profileBox.js';
import { connect } from "react-redux";
import { SELECT_CONNECTION, NEW_MESSAGE, UPDATE_MESSAGES } from "../actions/actions.js";
import axios from 'axios';

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
    // if (this.props.messages) {
    //   let messagesToRender = this.props.messages.filter(message => !(message.chat.messages.messages.length === 1 && message.chat.messages.messages[0].author === this.props.loggedIn));
    //   if (messagesToRender.length) {
    //   this.props.selectConUserAction(messagesToRender[0]);
    //   }
    // }
  }

  send() {
    // create new message object to add to array
    let newMessage = {
      author: `${this.props.loggedIn}`,
      text: this.state.text,
      timestamp: Date.now()
    }
    // craft new chat object with which to update state and database
    let oldChat =this.props.selectedConnection.chat;
    let newMessagesArray = oldChat.messages.messages.slice();
    newMessagesArray.push(newMessage);
    let newLength = oldChat.current_length + 1;
    let userViewToUpdate = oldChat.user1 === this.props.loggedIn ? 'lastViewed1' : 'lastViewed2';
    let chatToUpdate = Object.assign({}, oldChat, {
      messages: {messages: newMessagesArray},
      current_length: newLength,
      [userViewToUpdate]: newLength
    });
    // dispatch action to update store 'selectedConnection' for immediate rendering
    this.props.renderNewMessageAction(chatToUpdate);
    // send call to database to update chat object
    axios.patch('/message', {
      user: this.props.loggedIn,
      viewCountToUpdate: userViewToUpdate,
      chat: chatToUpdate
    })
    .then(updatedMessages => {
      // update store's messages array
      this.props.updateMessagesAction(updatedMessages.data);
      // need to rebuild connetedUsers object in store************************************************
    })
    .catch(err => {
      console.log('error returned from call to update chat in database:', err);
    })
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
    this.props.selectConUserAction(user);
  }

  render() {

    return this.props.selectedConnection ?
    (
      <div>
        <Nav />
      <h1>THIS IS YOUR TRIP WITH {this.props.selectedConnection.otheruser.username} TO {this.props.cities[this.props.selectedConnection.chat.chat_city - 1].city}</h1>
        <div className="containerDiv">
            <div className="chatWindowDiv" ref="wrap">
              <ul className="chatbox">
              {/* // if messages array is empty, render dummy heading message - "start a conversation!" */}
                {this.props.selectedConnection.chat.messages.messages.map(
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
                            : this.props.selectedConnection.otheruser.picture
                        }
                        className="chatPicture"
                      />
                      <p className="senderName">
                        {this.props.profile.auth_id !== message.author
                          ? this.props.selectedConnection.otheruser.username
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
          </div>
        <ProfileBox profile={this.props.selectedConnection.otheruser}/>
        <div className="connectionsDiv">
          <h3>Connections:</h3>
          <ul>
            {/* // before rendering out connections, filter for message objects where "connection:true" */}
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
    ) :
    (<div>
      <Nav />
      Find people heading to the same places you are and then you can chat with them here!
    </div>);
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
    renderNewMessageAction: message => {
      dispatch({ type: NEW_MESSAGE, payload: message});
    },
    updateMessagesAction: messages => {
      dispatch({ type: UPDATE_MESSAGES, payload: messages });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mess);
