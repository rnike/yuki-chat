/* globals localStorage */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import phaseType from './types/phaseType';

const initialState = {
  socket: undefined,
  roomID: undefined,
  isOnChat: undefined,
  isConnected: undefined,
  isWaiting: undefined,
  phase: phaseType.DISCONNECT,
  message: [],
  onlineCount: undefined,
  chatControl: {
    follow: true,
    hasNew: false
  }
};
export const ACTION = {
  SOCKET: 'SOCKET',
  ROOMID: 'ROOMID',
  PHASECHANGE: 'PHASECHANGE',
  INIT: 'INIT',
  CLEARMSG: 'CLEARMSG',
  APPENDMSG: 'APPENDMSG',
  ONLINECOUNT: 'ONLINECOUNT',
  CHATCONTROL: 'CHATCONTROL'
};

export const FROM = {
  ME: 'ME',
  SERVER: 'SERVER',
  ELSE: 'ELSE'
};
const reducer = (state = initialState, { type, payload }) => {
  const { SOCKET, ROOMID, PHASECHANGE, INIT, CLEARMSG, APPENDMSG, ONLINECOUNT, CHATCONTROL } = ACTION;
  switch (type) {
    case SOCKET:
      return { ...state, socket: payload };
    case ROOMID:
      return { ...state, roomID: payload };
    case PHASECHANGE:
      if (payload === phaseType.START) {
        return { ...state, phase: payload, message: [], chatControl: { follow: true, hasNew: false } };
      }
      return { ...state, phase: payload };
    case INIT:
      return { ...state, ...payload };
    case CLEARMSG:
      return { ...state, message: [] };
    case APPENDMSG:
      const data = {
        ...payload,
        from: payload.from === 'server' ? FROM.SERVER : payload.from === state.socket.id ? FROM.ME : FROM.ELSE
      };
      return { ...state, message: state.message.concat(data) };
    case ONLINECOUNT:
      return { ...state, onlineCount: payload };
    case CHATCONTROL:
      return { ...state, chatControl: payload };
    default:
      return state;
  }
};

export default () => {
  const store = createStore(reducer, applyMiddleware(thunk));
  return store;
};
