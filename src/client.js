import { ACTION } from './store';
const io = require('socket.io-client');
const phaseType = require('./types/phaseType');

var socket, roomID, isOnChat, isConnected;
export default () => dispatch => {
  const { CONNECT } = phaseType;
  socket = io();
  socket.on(CONNECT, data => {
    if (data === 'ok') {
      dispatch({ type: ACTION.PHASECHANGE, payload: CONNECT });
    }
  });
  socket.on('message', data => {
    dispatch({ type: ACTION.APPENDMSG, payload: data });
  });
  socket.on('online', data => {
    dispatch({ type: ACTION.ONLINECOUNT, payload: data });
  });

  dispatch({ type: ACTION.INIT, payload: { socket, roomID, isOnChat, isConnected } });
};
