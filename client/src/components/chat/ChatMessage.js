import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addChat, getChat, sendMessageSoc, addM } from '../../actions/chat';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import './ChatMessage.css';

const ChatMessage = ({
  socket,
  addChat,
  getChat,
  addM,
  sendMessageSoc,
  auth: { user },
  chat: { loading, chats, selectedId },
}) => {
  /*useEffect(() => {
    getChat(selectedId);
  }, [getChat]);*/

  const [toId, setToId] = useState(null);

  const [formData, setFormData] = useState({
    to: toId,
    message: '',
  });

  if (toId !== selectedId) {
    setToId(selectedId);
    setFormData({ ...formData, to: selectedId });
    getChat(selectedId);
  }
  const from = user._id;
  const { to, message } = formData;
  const onChange = (e) => setFormData({ ...formData, message: e.target.value });

  const submitMessage = (e) => {
    e.preventDefault();
    addChat({ from, to, message });
    sendMessageSoc({ socket, from, to, message });
  };

  const messages = chats.map((c, index) => (
    <li
      key={index}
      className={
        user._id === c.from
          ? 'message-left message-list'
          : 'message-right message-list'
      }
    >
      {c.message}
    </li>
  ));

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className='message-wrapper'>
        <div className='message-container1'>
          <ul>{messages}</ul>
        </div>
        <div className='message-typer'>
          <form onSubmit={(e) => submitMessage(e)}>
            <textarea
              className='message form-control'
              value={message}
              placeholder='Type and hit Enter'
              onChange={(e) => onChange(e)}
            ></textarea>
            <input type='submit' value='Send' />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

ChatMessage.propTypes = {
  addChat: PropTypes.func.isRequired,
  getChat: PropTypes.func.isRequired,
  sendMessageSoc: PropTypes.func.isRequired,
  addM: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
  chat: state.chat,
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStatetoProps, {
  addChat,
  getChat,
  sendMessageSoc,
  addM,
})(ChatMessage);
