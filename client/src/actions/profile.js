import axios from 'axios';
import { setAlert } from './alert';

import {
  DELETE_ACCOUNT,
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GET_PROFILES,
  REMOVE_REQUEST,
  ADD_FRIEND,
  ADD_REQUEST,
} from './types';

//Get cureent user profile

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//Get profiles by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Crete/Update Profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete Acc and Profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure?')) {
    try {
      await axios.delete(`/api/profile`);

      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({
        type: DELETE_ACCOUNT,
      });
      dispatch(setAlert('Accoutn deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Send request
export const sendreq = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/profile/sendreq/${id}`);
    dispatch({
      type: ADD_REQUEST,
      payload: res.data,
    });
    console.log(res.data);
    dispatch(setAlert('Friend Added'));
  } catch (err) {
    console.log(err);
  }
};

//Add request
export const addreq = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/profile/addfriend/${id}`);
    dispatch({
      type: REMOVE_REQUEST,
      payload: id,
    });
    dispatch({
      type: ADD_FRIEND,
      payload: res.data,
    });
    dispatch(setAlert('Friend Added'));
  } catch (err) {
    console.log('adfscz');
  }
};

//Get Image
export const getImage = (avatar) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/image/${avatar}`);
    return res;
  } catch (err) {
    console.log('adfscz');
  }
};

export const uploadStory = ({ file }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  let formData = new FormData();

  formData.append('file', file);

  try {
    const res = await axios.post('/api/profile/uploadStory', formData, config);

    /*dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });*/
    return res;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    //dispatch({ type: REGISTER_FAIL });
  }
};
