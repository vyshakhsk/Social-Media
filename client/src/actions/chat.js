import axios from 'axios';
import { setAlert } from './alert';
import { GET_CHATS, ADD_CHAT, CH_SEL, ADD_CHATT } from './types';

//Add Chat
export const addChat = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/chat/add', formData, config);

    dispatch({
      type: ADD_CHATT,
      payload: res.data,
    });
    dispatch(setAlert('Chat Added', 'success'));
  } catch (err) {
    console.log(err);
  }
};
//Get Chat
export const getChat = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/chat/${id}`);

    dispatch({
      type: GET_CHATS,
      payload: res.data,
    });
  } catch (err) {}
};

//Add Socket User
export const addSocUser = ({ socket, userId }) => async (dispatch) => {
  try {
    socket.emit('add-user', { userId });
  } catch (err) {}
};

//Send message to socketid
export const sendMessageSoc = ({ socket, from, to, message }) => async (
  dispatch
) => {
  try {
    const chat = { from, to, message };
    socket.emit('send-message', chat);
  } catch (err) {}
};
export const addM = (data) => async (dispatch) => {
  dispatch({
    type: ADD_CHAT,
    payload: data,
  });
};

export const changeSel = (id) => async (dispatch) => {
  console.log(id);
  dispatch({
    type: CH_SEL,
    payload: id,
  });
};
