import styles from '../styles/Admin.module.css';
import Head from 'next/head';
import useSocket from "../hooks/useSocket";
import {useEffect, useState} from "react";

export default function Admin(props) {

  const socket = useSocket();

  const [showComments, setShowCommentsInState] = useState(false);
  const [commentingEnabled, setCommentingEnabled] = useState(true);

  const setShowComments = (value) => {
    socket.emit('setShowComments', value);
  }

  useEffect(() => {

    if (socket) {

      socket.on('showComments', (data) => {
        setShowCommentsInState(data);
      });

    }

  }, [socket]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin - Kommentarcheck</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Admin - Kommentarcheck</h1>
        <h3>Berechtigungen</h3>
        <div className={styles.states}>
          <button
            className={styles.checkbox}
            onClick={() => setShowComments(!showComments)}
            style={{
              backgroundColor: showComments ? 'var(--green)' : 'var(--red)',
            }}
          >
            Kommentare zeigen
          </button>
          <button
            className={styles.checkbox}
            onClick={() => setCommentingEnabled(!commentingEnabled)}
            style={{
              backgroundColor: commentingEnabled ? 'var(--green)' : 'var(--red)',
            }}
          >
            Kommentieren
          </button>
        </div>
      </main>
    </div>
  )
}
