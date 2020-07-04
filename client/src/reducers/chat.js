import { GET_CHATS, ADD_CHAT, CH_SEL, ADD_CHATT } from '../actions/types';

const initialState = {
  chats: [],
  selectedId: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CHATS:
      return {
        ...state,
        chats: payload,
        loading: false,
      };

    case ADD_CHAT:
      return {
        ...state,
        chats:
          state.selectedId === payload.from
            ? [...state.chats, payload]
            : [...state.chats],
        loading: false,
      };

    case ADD_CHATT:
      return {
        ...state,
        chats: [...state.chats, payload],

        loading: false,
      };

    case CH_SEL:
      return {
        ...state,
        selectedId: payload,
        loading: false,
      };
    default:
      return state;
  }
}
