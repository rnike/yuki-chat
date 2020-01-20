import { ACTION } from './store';
const messageType = require('./types/messageType');
const phaseType = require('./types/phaseType');
export const start = ({ phase, socket }) => dispatch => {
  const { START, BEGIN, END, DISCONNECT, CONNECT } = phaseType;
  if (phase === DISCONNECT || phase === START || phase === BEGIN) return;
  socket.emit(START, socket.id);
  dispatch({ type: ACTION.PHASECHANGE, payload: START });

  socket.on(START, data => {
    dispatch({ type: ACTION.ROOMID, payload: data });
    socket.removeListener(START);
  });
  socket.on(BEGIN, () => {
    dispatch({ type: ACTION.PHASECHANGE, payload: BEGIN });
    socket.removeListener(BEGIN);
  });
  socket.on(END, home => {
    dispatch({ type: ACTION.PHASECHANGE, payload: home ? CONNECT : END });
    if (home) socket.removeListener(END);
    socket.removeListener(BEGIN);
    socket.removeListener(START);
  });
};
export const end = ({ phase, socket, roomID }, home) => dispatch => {
  const { START, BEGIN, END } = phaseType;
  if (phase !== START && phase !== BEGIN && phase !== END) return;
  socket.emit(END, roomID, home);
};
export const sendText = ({ phase, socket, roomID }, text) => dispatch => {
  const { BEGIN } = phaseType;
  if (phase !== BEGIN) return;
  socket.emit(messageType.TEXT, roomID, text);
};
