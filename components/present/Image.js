import styles from '../../styles/present/Image.module.css';
import {useEffect} from "react";

export default function Image(props) {

  const { image } = props;

  return (
    <main>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img
        className={styles.img}
        src={image}
        alt={'Kein Bild vorhanden'}
      /> : null}
    </main>
  )
}
