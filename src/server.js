const uuid = require('uuid');
const message = require('./modules/message');
const messageType = require('./types/messageType');
const phaseType = require('./types/phaseType');
const { Map } = require('immutable');
module.exports = http => {
  const io = require('socket.io')(http);
  var rooms = Map();
  const { CONNECT, START, BEGIN, END } = phaseType;
  const { TEXT } = messageType;
  io.on('connect', socket => {
    // connection
    socket.on(START, id => {
      const [...waitingRooms] = rooms.filter(x => !x.full).keys();
      var roomID;
      if (waitingRooms.length > 0) {
        roomID = waitingRooms[0];
        rooms = rooms.remove(roomID);
        socket.join(roomID, () => {
          socket.emit(START, roomID);
          io.to(roomID).emit('message', message('server', messageType.TEXT, 'Chat begin'));
          io.to(roomID).emit(BEGIN);
        });
      } else {
        roomID = `${uuid.v1()}`;
        rooms = rooms.set(roomID, { c1: id, full: false });
        socket.join(roomID, () => {
          socket.emit(START, roomID);
        });
      }
    });
    socket.on(BEGIN, socket => {});
    socket.on(END, (roomID, home) => {
      rooms = rooms.remove(roomID);
      if (home) {
        socket.emit(END, home);
      } else {
        io.to(roomID).emit('message', message('server', messageType.TEXT, 'Chat end (Someone has left the chat)'));
        io.to(roomID).emit(END);
      }
      socket.leaveAll();
    });
    socket.on('disconnecting', reason => {
      const roomID = [...Map(socket.rooms).keys()][1];
      if (roomID) {
        rooms = rooms.remove(roomID);
        socket.leaveAll();
        io.to(roomID).emit('message', message('server', messageType.TEXT, 'Chat end (Someone has left the chat)'));
        io.to(roomID).emit(END);
      }
    });

    socket.on('disconnect', reason => {
      io.sockets.emit('online', io.engine.clientsCount);
    });
    // msg
    socket.on(TEXT, (roomID, msg) => {
      io.to(roomID).emit('message', message(socket.id, TEXT, msg));
    });
    io.sockets.emit('online', io.engine.clientsCount);
    socket.emit(CONNECT, 'ok');
  });
};
