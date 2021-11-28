import {Server} from "socket.io";

// a state of our comments (don't need to save more things)
const myComments = [];

// save current temporary state
const state = {
  showComments: false,
  commentingEnabled: false,
  imageNumber: 0,
  presented: 'image',
}

export default function handler(req, res) {

  // initialize our socket if it doesn't exist
  if (!res.socket.server.io) {

    // create a Socket Server
    const io = new Server(res.socket.server);

    io.on('connection', async rawSocket => {

      // Setup custom socket methods
      let socket = rawSocket

      socket.all = (ev, args) => {
        socket.emit(ev, args);
        socket.broadcast.emit(ev, args);
      };

      socket.publishComments = async () => {
        socket.all('set', await getComments());
        socket.all('commentAmount', await getLength());
      }

      // comment amount (only on request)
      socket.on('commentAmount', async() => {
        socket.emit('commentAmount', await getLength())
      });

      // get our comments
      socket.emit('set', await getComments());

      // send current image
      socket.emit('setImage', myComments[state.imageNumber] || null);

      // add a new comment
      socket.on('post', async (item) => {
        await postComment(item);
        await socket.publishComments();
      });

      // delete all comments
      socket.on('reset', async () => {
        await resetComments();
        await socket.publishComments();
      });

      // delete a not so nice comment
      socket.on('deleteComment', async (comment) => {
        await deleteComment(comment);
        await socket.publishComments();
      });

      // inform our admins to fetch the nice little new image
      socket.on('postedImage', () => {
        socket.all('postedImage');
        socket.all('imageNumber', state.imageNumber);
      });

      // react to state changes
      Object.keys(state).forEach((key) => {
        socket.emit(key, state[key]);
        socket.on(key, (data) => {
          state[key] = data;
          socket.all(key, state[key]);
        });
      });
    });

    // apply io to our server
    res.socket.server.io = io;
  }

  res.end();
}

async function getComments() {
  return myComments;
}

async function getLength() {
  return myComments.length;
}

async function postComment(comment) {
  if (state.commentingEnabled) {
    return myComments.push(comment);
  } else {
    return null;
  }
}

async function deleteComment(comment) {
  return myComments.splice(myComments.indexOf(comment), 1);
}

async function resetComments() {
  return myComments.splice(0, myComments.length);
}

export const config = {
  api: {
    bodyParser: false
  }
}
