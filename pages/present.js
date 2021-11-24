import styles from '../styles/Present.module.css';
import Head from 'next/head';
import {useEffect, useState} from "react";
import useSocket from "../hooks/useSocket";

export default function Present() {

    const [showComments, setShowComments] = useState(false);
    const [commentingEnabled, setCommentingEnabled] = useState(true);
    const [commentAmount, setCommentAmount] = useState(0);

    const socket = useSocket();

    useEffect(() => {

        if (socket) {

            socket.emit('commentAmount');

            socket.on('commentAmount', (data) => {
                setCommentAmount(data);
            })

            socket.on('showComments', (data) => {
                setShowComments(data);
            });

            socket.on('commentingEnabled', (data) => {
                setCommentingEnabled(data);
            })

        }
    });

    return (
        <div className={styles.container}>
            <Head>
                <title>Übersicht - Kommentarcheck</title>
            </Head>
            <main className={styles.main}>
                <div className={styles.texts}>
                    <h2 className={styles.info}>
                        Kommentare sehen ist{' '}
                        <span style={{ color: `var(--${showComments ? 'green' : 'red'})`}}>
                        {showComments ? '' : 'de'}aktiviert
                    </span>
                    </h2>
                    <h2 className={styles.info}>
                        Kommentare schreiben ist{' '}
                        <span style={{ color: `var(--${commentingEnabled ? 'green' : 'red'})`}}>
                        {commentingEnabled ? '' : 'de'}aktiviert
                    </span>
                    </h2>
                </div>
                <div className={styles.commentAmount}>{commentAmount}</div>
            </main>
        </div>
    )
}
