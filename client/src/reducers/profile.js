import {
  UPDATE_PROFILE,
  PROFILE_ERROR,
  GET_PROFILE,
  CLEAR_PROFILE,
  GET_PROFILES,
  REQUEST_ERROR,
  REQUEST_SENT,
  REMOVE_REQUEST,
  ADD_FRIEND,
  ADD_REQUEST,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
        repos: [],
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case REQUEST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case REQUEST_SENT:
      return {
        ...state,
        loading: false,
      };
    case REMOVE_REQUEST:
      return {
        ...state,
        profile: {
          ...state.profile,
          request: state.profile.request.filter((req) => req._id !== payload),
        },
        loading: false,
      };
    case ADD_FRIEND:
      return {
        ...state,
        profile: { ...state.profile, friendsList: payload },
        loading: false,
      };
    case ADD_REQUEST:
      return {
        ...state,
        profile: { ...state.profile, request: payload },
        loading: false,
      };
    default:
      return state;
  }
}
