import {Server} from "socket.io";

// a state of our comments (don't need to save more things)
let myComments = [];

// save current temporary state
const state = {
  showComments: true,
  commentingEnabled: true,
  imageNumber: 0,
}

export default function handler(req, res) {

  // initialize our socket if it doesn't exist
  if (!res.socket.server.io) {

    // create a Socket Server
    const io = new Server(res.socket.server);

    io.on('connection', socket => {

      // send showComment state
      socket.emit('showComments', state.showComments);

      // get our comments
      socket.on('get', async () => {
        socket.emit('set', await get());
      });

      // add a new comment
      socket.on('post', async (item) => {
        await post(item);
        const comments = await get();
        socket.emit('set', comments);
        socket.broadcast.emit('set', comments);
      });

      // delete all comments
      socket.on('delete', del);

    });

    // apply io to our server
    res.socket.server.io = io;
  }

  res.end();
}

async function get() {
  if (state.showComments) {
    return myComments;
  } else {
    return [];
  }
}

async function post(comment) {
  if (state.commentingEnabled) {
    return myComments.push(comment);
  } else {
    return null;
  }
}

async function del() {
  myComments = [];
}

export const config = {
  api: {
    bodyParser: false
  }
}
