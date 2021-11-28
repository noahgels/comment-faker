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
  const [showComments, setShowComments] = useState(false);
  const [commentingEnabled, setCommentingEnabled] = useState(true);
  const [image, setImage] = useState(null);

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

      socket.on('imageNumber', (data) => {
        console.log('Trying');
        fetch('/api/image?index=' + data)
          .then(res => res.json())
          .then((res) => {
            setImage(res[0]);
          })
          .catch(() => {

          })
      });

    }

  }, [socket]);

  const postComment = (comment) => {
    if (socket) {
      socket.emit('post', comment);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image ? <img
            className={styles.img}
            src={image}
            alt={'Kein Bild vorhanden'}
          /> : null}
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


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};
