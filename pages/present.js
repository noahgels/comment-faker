import Head from 'next/head';
import {useEffect, useState} from "react";
import useSocket from "../hooks/useSocket";
import Stats from "../components/present/Stats";
import Image from "../components/present/Image";
import Comments from "../components/present/Comments";
import Qr from "../components/present/Qr";

export default function Present() {

  const [showComments, setShowComments] = useState(false);
  const [commentingEnabled, setCommentingEnabled] = useState(true);
  const [commentAmount, setCommentAmount] = useState(0);
  const [presented, setPresented] = useState('');
  const [image, setImage] = useState(null);
  const [comments, setComments] = useState([]);

  const socket = useSocket();

  useEffect(() => {

    if (socket) {

      socket.emit('commentAmount');

      socket.on('commentAmount', (data) => {
        setCommentAmount(data);
      });

      socket.on('showComments', (data) => {
        setShowComments(data);
      });

      socket.on('commentingEnabled', (data) => {
        setCommentingEnabled(data);
      });

      socket.on('presented', (data) => {
        setPresented(data);
      });

      socket.on('imageNumber', (data) => {
        fetch('/api/image?index=' + data)
          .then(res => res.json())
          .then((res) => {
            setImage(res[0]);
          })
          .catch(() => {

          })
      });

      socket.on('set', (items) => {
        setComments(items);
      });

    }
  });

  return (
    <div>
      <Head>
        <title>Kommentarcheck</title>
      </Head>
      {(() => {
        switch (presented) {
          case 'comments':
            return (
              <Comments
                comments={comments}
              />
            );
          case 'image':
            return (
              <Image
                image={image}
              />
            );
          case 'qr':
            return <Qr/>
          default:
            return <Stats
              showComments={showComments}
              commentingEnabled={commentingEnabled}
              commentAmount={commentAmount}
            />
        }
      })()}
    </div>
  )
}
