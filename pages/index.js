import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";
import useSocket from "../hooks/useSocket";
import Link from 'next/link';

export default function Home() {

  const socket = useSocket();
  const [value, setValue] = useState('');
  const [comments, setComments] = useState([]);
  const [sentComments, setSentComments] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentingEnabled, setCommentingEnabled] = useState(true);

  useEffect(() => {

    if (socket) {

      socket.on('set', (items) => {
        setComments(items);
      });

      socket.on('showComments', (data) => {
        setShowComments(data);
      });

      socket.on('commentingEnabled', (data) => {
        setCommentingEnabled(data);
      })

    }

  }, [socket]);

  const postComment = (comment) => {
    if (socket) {
      if (sentComments < 3) {
        socket.emit('post', comment);
        setSentComments(sentComments + 1);
      } else {
        alert('Du hast vorerst genug geschrieben');
      }
      setValue('');
    } else {
      alert('Verbindung verloren... :(');
    }

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Kommentarcheck - Medienscouts</title>
      </Head>
      <main className={styles.main}>

        <div className={styles.imgPositioner}>
          <img
            className={styles.img}
            src={'/featured.jpg'}
            alt={'Kein Bild vorhanden'}
          />
        </div>
        <div className={styles.comments}>
          <h3 className={styles.commentsHeadline}>Kommentare</h3>
          <div className={styles.commentMap}>
            {showComments ? comments.map((comment, index) =>
              <div key={'comment' + index} className={styles.comment}>
                {comment}
              </div>
            ) : null}
          </div>
          {commentingEnabled ? <div className={styles.inputArea}>
            <input
              autoComplete={'false'}
              autoCorrect={'false'}
              size={1}
              className={styles.input}
              placeholder={'Kommentieren... '}
              onChange={(e) => setValue(e.target.value)}
              value={value}
              maxLength={255}
              onKeyDown={({code}) => {
                if (code === 'Enter' && value) {
                  postComment(value);
                }
              }}
            />
            <button
              className={styles.sendButton}
              disabled={!(commentingEnabled && value)}
              style={{
                color: value ? 'var(--action)' : 'var(--action-disabled)',
              }}
              onClick={value ? () => postComment(value) : null}
            >
              Senden
            </button>
          </div> : null}
          <Link href={'/about'}>
            <a>
              <h3
                style={{
                  color: 'var(--action)',
                }}
              >Impressum</h3>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}
