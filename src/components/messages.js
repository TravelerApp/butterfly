import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import ProfileBox from './profileBox.js';
import { connect } from "react-redux";
import { SELECT_CONNECTION, NEW_MESSAGE, UPDATE_MESSAGES, UPDATE_BLOCK, SELECT_TRIP } from "../actions/actions.js";
import axios from 'axios';
import moment from 'moment';

class Mess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      displayConnections: true,
      displayMessages: true
    };
    this.send = this.send.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.toggleConnectionsView = this.toggleConnectionsView.bind(this);
    this.toggleNewConnectionsView = this.toggleNewConnectionsView.bind(this);
    this.toggleMessagesView = this.toggleMessagesView.bind(this);
    this.toggleProfileView = this.toggleProfileView.bind(this);
  }

  componentDidMount() {
    console.log('mounting')
    if (this.props.sortedMessageData.ongoingMessages.length) {
      this.props.selectConUserAction(this.props.sortedMessageData.ongoingMessages[0]);
    }
  }

  send() {
    // create new message object to add to array
    let newMessage = {
      author: `${this.props.loggedIn}`,
      text: this.state.text,
      timestamp: new Date().toISOString()
    };
    // craft new chat object with which to update state and database
    let oldChat = this.props.selectedConnection.chat;
    let newMessagesArray = oldChat.messages.messages.slice();
    newMessagesArray.push(newMessage);
    let newLength = oldChat.current_length + 1;
    let userViewToUpdate =
      oldChat.user1 === this.props.loggedIn ? "lastViewed1" : "lastViewed2";
    let chatToUpdate = Object.assign({}, oldChat, {
      messages: { messages: newMessagesArray },
      current_length: newLength,
      [userViewToUpdate]: newLength
    });
    // dispatch action to update store 'selectedConnection' for immediate rendering
    this.props.renderNewMessageAction(chatToUpdate);
    // send call to database to update chat object
    axios
      .patch("/message", {
        action: "new message",
        user: this.props.loggedIn,
        viewCountToUpdate: userViewToUpdate,
        chat: chatToUpdate
      })
      .then(updatedMessages => {
        // update store's messages array
        this.props.updateMessagesAction(updatedMessages.data);
      })
      .catch(err => {
        console.log(
          "error returned from call to update chat in database:",
          err
        );
      });
  }
  onChange(e) {
    this.setState({ text: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.send();
    e.target.reset();
    this.setState({ text: "" });
  }
  componentDidUpdate() {
    // <div className="chatWindowDiv" ref="wrap">
    if (this.refs.wrap) {
      var el = this.refs.wrap;
      el.scrollTop = el.scrollHeight;
    }
  }
  handleConnectionClick(user) {
    // reset state text in case they had typed a message they didn't end up sending
    this.props.selectConUserAction(user);
  }
  handleBlock(toBlock) {
    if (
      confirm("are you realllllly sure? this person will be gone FOREVERRRRR")
    ) {
      let user = this.props.loggedIn;
      let userBlocked = this.props.profile.blocked;
      let otheruserBlocked = this.props.selectedConnection.otheruser.blocked;
      this.props.selectConUserAction(null);
      this.props.selectTripAction(null);
      axios
        .patch("/block", {
          user,
          newUserBlocked: { ...userBlocked, [toBlock]: user },
          toBlock,
          newOtheruserBlocked: { ...otheruserBlocked, [user]: user }
        })
        .then(updatedTripsAndChats => {
          // update store's messages array - write new action and reducer and import
          console.log(updatedTripsAndChats);
          this.props.updateAfterBlockAction(updatedTripsAndChats.data);
        })
        .catch(err => {
          console.log("error returned from call to block user", err);
        });
    }
  }
  toggleConnectionsView() {
    if (!this.state.displayConnections) {
      this.setState(prevState => {
        return { ...prevState, displayConnections: true };
      });
    }
  }
  toggleNewConnectionsView() {
    if (this.state.displayConnections) {
      this.setState(prevState => {
        return { ...prevState, displayConnections: false };
      });
    }
  }
  toggleMessagesView() {
    if (!this.state.displayMessages) {
      this.setState(prevState => {
        return { ...prevState, displayMessages: true };
      });
    }
  }
  toggleProfileView() {
    if (this.state.displayMessages) {
      this.setState(prevState => {
        return { ...prevState, displayMessages: false };
      });
    }
  }
  renderConnections() {
    let app = this;
    let connectionsList = (
      <span id="connectionsListEmpty">-- No  Connections --</span>
    );
    if (this.props.sortedMessageData.ongoingMessages.length) {
      connectionsList = (
        <ul id="connectionsList">
          {this.props.sortedMessageData.ongoingMessages.map((message, i) => (
            <li
              className="connectionsListItem"
              key={i}
              onClick={this.handleConnectionClick.bind(this, message)}
            >
              <img
                className="connectionsListPicture"
                src={message.otheruser.picture}
              />
              <span className="connectionsListName">
                {message.otheruser.username}
              </span>
              <span className="connectionsListCity">
                {app.props.cities[message.chat.chat_city - 1].city}
              </span>
              <span className="connectionBreak" />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div id="sidebar">
        <div id="sidebarButtons">
          <span
            className="messageConnectionsButton"
            id="connectionsButton"
            onClick={app.toggleConnectionsView}
          >
            Connections
          </span>
          <span
            className="messageConnectionsButton"
            onClick={app.toggleNewConnectionsView}
          >
            New Connections
          </span>
        </div>
        {connectionsList}
      </div>
    );
  }
  renderNewConnections() {
    let app = this;
    let newConnectionsList = (
        <span id="connectionsListEmpty">-- No New Connections --</span>
    );
    if (this.props.sortedMessageData.newConnections.length) {
      newConnectionsList = (
        <ul id="connectionsList">
          {this.props.sortedMessageData.newConnections.map((message, i) => (
            <li
              className="connectionsListItem"
              key={i}
              onClick={this.handleConnectionClick.bind(this, message)}
            >
              <img
                className="connectionsListPicture"
                src={message.otheruser.picture}
              />
              <span className="connectionsListName">
                {message.otheruser.username}
              </span>
              <span className="connectionsListCity">
                {app.props.cities[message.chat.chat_city - 1].city}
              </span>
              <span className="connectionBreak" />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div id="sidebar">
        <div id="sidebarButtons">
          <span
            className="messageConnectionsButton"
            id="connectionsButton"
            onClick={app.toggleConnectionsView}
          >
            Connections
          </span>
          <span
            className="messageConnectionsButton"
            onClick={app.toggleNewConnectionsView}
          >
            New Connections
          </span>
        </div>
        {newConnectionsList}
      </div>
    );
  }
  render() {
    console.log("selectedConnection:", this.props.selectedConnection);
    let messagesToRender;
    if (this.props.selectedConnection === null) {
      messagesToRender = null;
    } else {
      messagesToRender = this.props.selectedConnection.chat.messages.messages
        .length
        ? this.props.selectedConnection.chat.messages.messages
        : null;
    }
    return this.props.sortedMessageData ? (
      <div id="topContainer">
        <Nav />
        <div id="messagesPageContainer">
          {this.state.displayConnections
            ? this.renderConnections()
            : this.renderNewConnections()}
          {this.props.selectedConnection ? (
            <div id="selectedConnectionBox">
              <div id="selectedConnectionButtons">
                <div id='buttonsContainer'>
                <span className="button" onClick={this.toggleMessagesView}>Messages</span>
                <span className="button" onClick={this.toggleProfileView}>Profile</span>
                <span
                  className="button"
                  id="delete"
                  onClick={() =>
                    this.handleBlock(
                      this.props.selectedConnection.otheruser.auth_id
                    )
                  }
                >Remove</span>
                </div>
              </div>
              {this.state.displayMessages ? messagesToRender ?
                    (<ul id="chatBox">
                      {messagesToRender.map((message, i) => (
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
                                : this.props.selectedConnection.otheruser
                                    .picture
                            }
                            className={
                              this.props.profile.auth_id === message.author
                                ? "senderPicture"
                                : "receiverPicture"
                            }
                          />
                          <p className="messageName">
                            {this.props.profile.auth_id !== message.author
                              ? this.props.selectedConnection.otheruser.username
                              : this.props.profile.username}
                            :{" "}
                          </p>
                          <p
                            className={
                              this.props.profile.auth_id === message.author
                                ? "senderText"
                                : "receiverText"
                            }
                          >
                            {message.text}
                          </p>
                          <p
                            className="messageStamp">
                            {message.timestamp
                              ? moment(message.timestamp).fromNow()
                              : ""}
                          </p>
                        </li>
                      ))}
                    </ul>) :
                    (<div className="selectedConnectionEmptyMessages">
                      SEND A MESSAGE, GET THE CONVERSATION GOING!!!!!!!!
                    </div>) : 
                    (<ProfileBox profile={this.props.selectedConnection.otheruser} />)}
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
                    className="chatSendButton button"
                  />
                </form>
              </div>
            </div>
          ) : (
            <div id="selectedConnectionBox">
              {this.props.sortedMessageData.ongoingMessages.length ? (
                <div id="noConnectionSelected">
                  Select a connection to see their messages
                </div>
              ) : this.props.sortedMessageData.newConnections.length ? (
                <div id="noConnectionSelected">
                  Send one of your new connections a message!
                </div>
              ) : (
                <div id="noConnectionSelected">
                  Find people heading to the same places you are and then you
                  can chat with them here!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ) : (
      ""
    );
  }
}
//---------------------------- REDUX ----------------------------
const mapStateToProps = state => {
  return {
    cities: state.cities,
    messages: state.messages,
    profile: state.profile,
    loggedIn: state.loggedIn,
    selectedConnection: state.selectedConnection,
    sortedMessageData: state.sortedMessageData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    selectConUserAction: connection => {
      dispatch({ type: SELECT_CONNECTION, payload: connection });
    },
    renderNewMessageAction: message => {
      dispatch({ type: NEW_MESSAGE, payload: message });
    },
    updateMessagesAction: messages => {
      dispatch({ type: UPDATE_MESSAGES, payload: messages });
    },
    updateAfterBlockAction: updates => {
      dispatch({ type: UPDATE_BLOCK, payload: updates });
    },
    selectTripAction: trip => {
      dispatch({ type: SELECT_TRIP, payload: trip });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mess);