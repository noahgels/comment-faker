import styles from '../styles/Admin.module.css';
import Head from 'next/head';
import useSocket from "../hooks/useSocket";
import {useEffect, useState} from "react";
import ImageCompression from 'browser-image-compression';
import PreviewImage from "../components/admin/PreviewImage";
import PresentButton from "../components/admin/PresentButton";
import Link from "next/link";

export default function Admin(props) {

  const socket = useSocket();

  const [showComments, setShowCommentsInState] = useState(null);
  const [commentingEnabled, setCommentingEnabledInState] = useState(null);
  const [comments, setComments] = useState([]);
  const [imageNumber, setImageNumber] = useState(0);
  const [images, setImages] = useState([]);
  const [presented, setPresented] = useState('');

  useEffect(() => {

    // always load our images
    fetch('/api/image?index=-1')
      .then(res => res.json())
      .then((res) => {
        setImages(res);
      })

    if (socket) {

      socket.emit('allImages');

      socket.on('allImages', (data) => {
        setImages(data);
      })

      socket.on('showComments', (data) => {
        setShowCommentsInState(data);
      });

      socket.on('commentingEnabled', (data) => {
        setCommentingEnabledInState(data);
      });

      socket.on('imageNumber', (data) => {
        setImageNumber(data);
      });

      socket.on('set', (items) => {
        setComments(items);
      });

      socket.on('presented', (data) => {
        setPresented(data);
      })

      socket.on('postedImage', () => {
        fetch('/api/image?index=-1')
          .then(res => res.json())
          .then((res) => {
            setImages(res);
          })
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

  const deleteImage = (index) => {
    fetch('/api/image', {
      method: 'DELETE',
      body: JSON.stringify({
        index: index,
      })
    })
      .then(() => {
        if (imageNumber === images.length - 1 && imageNumber > 0) {
          socket.emit('imageNumber', imageNumber - 1);
        }
        socket.emit('postedImage');
      })
      .catch(() => {
        alert('Noah hat verkackt');
      });
  }

  const uploadImage = async (e) => {

    // read image as uri from file input
    const imageFile = e.target.files[0];

    // compress our image to max 4mb (limit for NextJS) and maximum 1920px... we don't need more
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {

      // read our image as compressed file
      const compressedFile = await ImageCompression(imageFile, options);

      // read compressed file as base64 image
      const reader = new FileReader();
      reader.onloadend = function () {

        // extract base64 data from reader
        const base64data = reader.result;

        // upload to server
        fetch('/api/image', {
          method: 'POST',
          body: JSON.stringify({
            image: base64data,
          }),
        })
          .then(() => {
            // inform our clients about the new image
            socket.emit('postedImage');
          })
          .catch(() => {
            // tell our user that he is shit
            alert('Wie Jonas so schön sagte: Jetzt müssen wir dem Nutzer sagen dass er Scheiße ist')
          })
      }
      // start our event
      reader.readAsDataURL(compressedFile);
    } catch (e) {
      console.log(e);
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

        <h3>Präsentation</h3>
        {typeof presented === 'string' ? <div className={styles.states}>
          <PresentButton
            name={''}
            title={'Stats'}
            socket={socket}
            presented={presented}
          />
          <PresentButton
            name={'image'}
            title={'Bild'}
            socket={socket}
            presented={presented}
          />
          <PresentButton
            name={'comments'}
            title={'Kommentare'}
            socket={socket}
            presented={presented}
          />
          <PresentButton
            name={'qr'}
            title={'QR-Code'}
            socket={socket}
            presented={presented}
          />
        </div> : null}

        <h3>Kommentare</h3>
        {comments.length ?
          <>
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
            </div>)}
            <button
              className={styles.deleteCommentButton}
              onClick={() => socket.emit('reset')}
            >
              Reset
            </button>
          </>
          : <p>Es sind noch keine Kommentare vorhanden</p>}


        <h3>Bilder</h3>
        {images.length ? <ul className={styles.images}>
          {images.map((image, index) =>
            <li key={'image' + index} className={styles.imageItem}>
              <PreviewImage
                image={image}
                index={index}
                imageNumber={imageNumber}
                deleteImage={() => deleteImage(index)}
                selectImage={() => socket.emit('imageNumber', index)}
              />
            </li>)}
        </ul> : null}
        <h3>Hochladen</h3>
        <input
          className={styles.filePicker}
          name={'Hi'}
          type={'file'}
          accept={'.jpg,.png'}
          onChange={uploadImage}
        />
        <Link href={'/about'}>
          <a>
            <h3
              style={{
                color: 'var(--action)',
              }}
            >Impressum</h3>
          </a>
        </Link>
      </main>
    </div>
  )
}
