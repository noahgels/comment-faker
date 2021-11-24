import styles from '../styles/Admin.module.css';
import Head from 'next/head';
import useSocket from "../hooks/useSocket";
import {useEffect, useState} from "react";

export default function Admin(props) {

  const socket = useSocket();

  const [showComments, setShowCommentsInState] = useState(null);
  const [commentingEnabled, setCommentingEnabledInState] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (socket) {

      socket.on('showComments', (data) => {
        setShowCommentsInState(data);
      });

      socket.on('commentingEnabled', (data) => {
        setCommentingEnabledInState(data);
      });

      socket.on('set', (items) => {
        setComments(items);
      });


    }
  }, [socket]);

  const setShowComments = (value) => {

    if (socket) {
      socket.emit('showComments', value);
    }

  }

  const setCommentingEnabled = (value) => {

    if (socket) {
      socket.emit('commentingEnabled', value);
    }

  }

  const deleteComment = (comment) => {

    if (socket) {
      socket.emit('deleteComment', comment);
    }

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin - Kommentarcheck</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Admin - Kommentarcheck</h1>
        <h3>Berechtigungen</h3>
        {typeof showComments === 'boolean' ? <div className={styles.states}>
          <button
            className={styles.checkbox}
            onClick={() => setShowComments(!showComments)}
            style={{
              backgroundColor: showComments ? 'var(--green)' : 'var(--red)',
            }}
          >
            Sehen
          </button>
          <button
            className={styles.checkbox}
            onClick={() => setCommentingEnabled(!commentingEnabled)}
            style={{
              backgroundColor: commentingEnabled ? 'var(--green)' : 'var(--red)',
            }}
          >
            Schreiben
          </button>
        </div> : null}
        <h3>Kommentare</h3>
        {comments.map((comment, index) =>
        <div key={'comment' + index} className={styles.comment}>
          <div className={styles.commentText}>
            {comment}
          </div>
          <button
              className={styles.deleteCommentButton}
              onClick={() => deleteComment(comment)}
          >
            Löschen
          </button>
        </div>
        )}
      </main>
    </div>
  )
}
