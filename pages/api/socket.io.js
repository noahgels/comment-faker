import {Server} from "socket.io";

// a state of our comments (don't need to save more things)
let myComments = [];

// save current temporary state
const state = {
  showComments: false,
  commentingEnabled: true,
  imageNumber: 0,
}

export default function handler(req, res) {

  // initialize our socket if it doesn't exist
  if (!res.socket.server.io) {

    // create a Socket Server
    const io = new Server(res.socket.server);

    io.on('connection', async rawSocket => {

      let socket = rawSocket

      socket.all = (ev, args) => {
        socket.emit(ev, args);
        socket.broadcast.emit(ev, args);
      };

      socket.publishComments = async () => {
        socket.all('set', await get());
        socket.all('commentAmount', await getLength());
      }

      // comment amount (only on request)
      socket.on('commentAmount', async() => {
        socket.emit('commentAmount', await getLength())
      });

      // get our comments
      socket.emit('set', await get());


      // add a new comment
      socket.on('post', async (item) => {
        await post(item);
        await socket.publishComments();
      });

      // delete all comments
      socket.on('reset', reset);

      // delete a not so nice comment
      socket.on('deleteComment', async (comment) => {
        await deleteComment(comment);
        await socket.publishComments();
      });

      // react to state changes
      Object.keys(state).forEach((key) => {
        socket.emit(key, state[key]);
        socket.on(key, (data) => {
          state[key] = data;
          socket.all(key, state[key]);
        })
      });
    });

    // apply io to our server
    res.socket.server.io = io;
  }

  res.end();
}

async function get() {
  return myComments;
}

async function getLength() {
  return myComments.length;
}

async function post(comment) {
  if (state.commentingEnabled) {
    return myComments.push(comment);
  } else {
    return null;
  }
}

async function deleteComment(comment) {
  myComments.splice(myComments.indexOf(comment), 1);
}

async function reset() {
  myComments = [];
}

export const config = {
  api: {
    bodyParser: false
  }
}
