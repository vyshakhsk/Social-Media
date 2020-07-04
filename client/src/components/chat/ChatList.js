import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeSel } from '../../actions/chat';

const ChatList = ({ friendsList, changeSel, chat: { selectedId } }) => {
  function changeSelected(e) {
    let x = e.value;
    console.log(friendsList[x].friendId);
    //onChange(friendsList[x].friendId);
    changeSel(friendsList[x].friendId);
  }

  const friends = friendsList.map((f, index) => (
    <li
      key={f._id}
      value={index}
      className='list-li'
      onClick={(e) => changeSelected(e.target)}
    >
      {f.friendName}
    </li>
  ));

  return (
    <Fragment>
      <ul>{friends}</ul>
    </Fragment>
  );
};

ChatList.propTypes = {
  friendsList: PropTypes.array.isRequired,
  changeSel: PropTypes.func.isRequired,
};
const mapStatetoProps = (state) => ({
  chat: state.chat,
});
export default connect(mapStatetoProps, { changeSel })(ChatList);
