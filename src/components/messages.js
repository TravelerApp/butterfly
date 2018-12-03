import React from "react";
import Nav from "./navBar.js";
import Connected from "./connected.js";
import ProfileBox from './profileBox.js';
import { connect } from "react-redux";
import { SELECT_CONNECTION, NEW_MESSAGE, UPDATE_MESSAGES, UPDATE_BLOCK } from "../actions/actions.js";
import axios from 'axios';

class Mess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      // local state to switch between connections and new connections???
    };
    this.send = this.send.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
  }

  componentDidMount() {
    // change this once we have notifications working
    if (this.props.sortedMessageData.ongoingMessages.length) {
      this.props.selectConUserAction(this.props.sortedMessageData.ongoingMessages[0]);
    }
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
      action: 'new message',
      user: this.props.loggedIn,
      viewCountToUpdate: userViewToUpdate,
      chat: chatToUpdate
    })
    .then(updatedMessages => {
      // update store's messages array
      this.props.updateMessagesAction(updatedMessages.data);
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
    if (this.refs.wrap) {
      var el = this.refs.wrap;
      el.scrollTop = el.scrollHeight;
    }
  }

  handleConnectionClick(user) {
    this.props.selectConUserAction(user);
  }

  handleBlock(toBlock) {
    let user = this.props.loggedIn;
    let userBlocked = this.props.profile.blocked;
    let otheruserBlocked = this.props.selectedConnection.otheruser.blocked;
    this.props.selectConUserAction(null)
    axios.patch('/block', {
      user,
      newUserBlocked: {...userBlocked, [toBlock]: user},
      toBlock,
      newOtheruserBlocked: {...otheruserBlocked, [user]: user}
    })
    .then(updatedTripsAndChats => {
      // update store's messages array - write new action and reducer and import
      console.log(updatedTripsAndChats);
      this.props.updateAfterBlockAction(updatedTripsAndChats.data)
    })
    .catch(err => {
      console.log('error returned from call to block user', err);
    })
  }

  renderConnections(){
    let connectionsList = 'Send some messages and people will show up here';

    if (this.props.sortedMessageData.ongoingMessages.length) {
      connectionsList = (
          <ul>
            {this.props.sortedMessageData.ongoingMessages
            .map((message, i) =>
              <li
                key={i}
                onClick={this.handleConnectionClick.bind(this, message)}
              >
                {message.otheruser.username}
              </li>)}
          </ul>
      )
    }
    return (
    <div className="connectionsDiv">
      Connections:
      {connectionsList}
    </div>
    )
  }

  renderNewConnections(){
    let newConnectionsList = 'No recent connections made';

    if (this.props.sortedMessageData.newConnections.length) {
      newConnectionsList = (
          <ul>
            {this.props.sortedMessageData.newConnections
            .map((message, i) =>
              <li
                key={i}
                onClick={this.handleConnectionClick.bind(this, message)}
              >
                {message.otheruser.username}
              </li>)}
          </ul>
      )
    }
    return (
    <div className="newConnectionsDiv">
      New Connections:
      {newConnectionsList}
    </div>
    )
  }

  render() {
    console.log('selectedConnection:', this.props.selectedConnection);

    let messagesToRender;
    if (this.props.selectedConnection === null) {
      messagesToRender = null
    } else {
      messagesToRender = this.props.selectedConnection.chat.messages.messages.length ? this.props.selectedConnection.chat.messages.messages : null;
    }

    return (
      <div>
        <Nav />
        {this.renderConnections()}
        {this.renderNewConnections()}
        {this.props.selectedConnection ?
          (<div>
            <h1>MESSAGES WITH {this.props.selectedConnection.otheruser.username} ABOUT YOUR TRIP TO {this.props.cities[this.props.selectedConnection.chat.chat_city - 1].city}</h1>
              <div className="containerDiv">
                { messagesToRender ?
                  (<div className="chatWindowDiv" ref="wrap">
                  <ul className="chatbox">
                    {messagesToRender.map(
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
                </div>) :
              (<div>SEND A MESSAGE, GET THE CONVERSATION GOING!!!!!!!!</div>)
              }
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
            <button onClick={() => this.handleBlock(this.props.selectedConnection.otheruser.auth_id)}>
            Delete Connection
            </button>
          </div>
        ) :
        (<div>
          {this.props.sortedMessageData.ongoingMessages.length ? 'Select a connection to see their messages'
            : this.props.sortedMessageData.newConnections.length ? 'Send one of your new connections a message!'
            : 'Find people heading to the same places you are and then you can chat with them here!'}
          </div>)
        }
      </div>
    )
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
      dispatch({ type: NEW_MESSAGE, payload: message});
    },
    updateMessagesAction: messages => {
      dispatch({ type: UPDATE_MESSAGES, payload: messages });
    },
    updateAfterBlockAction: updates => {
      dispatch({ type: UPDATE_BLOCK, payload: updates });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mess);
