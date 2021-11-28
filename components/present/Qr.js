import styles from '../../styles/present/Qr.module.css';
import QRCode from "qrcode";
import Head from "next/head";
import {useState} from "react";

export default function Qr(props) {

  const [image, setImage] = useState('image');

  QRCode.toDataURL('http://192.168.178.65:3000')
    .then((url) => {
      setImage(url);
    });


  return (
    <main className={styles.main}>
      <div
        className={styles.qrContainer}
      >
        <img
          src={image} alt={'Der QR Code konnte nicht generiert werden'}
          className={styles.img}
        />
      </div>
    </main>
  )
}
