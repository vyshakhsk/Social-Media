import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import { getChat, addSocUser, addM } from '../../actions/chat';
import ChatList from './ChatList';
import ChatMessage from './ChatMessage';
import Spinner from '../layout/Spinner';
import './Chat.css';
import openSocket from 'socket.io-client';

const Chat = ({
  auth: { user },
  profile: { profile, loading },
  chat: { selectedId },
  getCurrentProfile,
  getChat,
  addM,
  addSocUser,
}) => {
  const socket = openSocket('http://localhost:4000');
  useEffect(() => {
    getCurrentProfile();
    addSocUser({ socket, userId: user._id });
  }, [getCurrentProfile]);

  //const [selectedId, setSelectedId] = useState(null);

  socket.on('rec-message', function (data) {
    console.log(selectedId);
    addM(data);
  });
  /*function chatListChange(newSelect) {
    setSelectedId(newSelect);

    //getChat(selectedId);
  }
*/
  const userId = user._id;

  return loading || profile === null ? (
    <Spinner />
  ) : (
    <div className='app-page'>
      <div className='row'>
        <div className='col-3' id='left'>
          <ChatList friendsList={profile.friendsList} />
        </div>
        <div className='col-8' id='right'>
          {selectedId !== null && <ChatMessage socket={socket} />}
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getChat: PropTypes.func.isRequired,
  addSocUser: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  chat: state.chat,
});

export default connect(mapStatetoProps, {
  getCurrentProfile,
  getChat,
  addSocUser,
  addM,
})(Chat);
