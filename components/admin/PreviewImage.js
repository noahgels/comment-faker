import styles from "../../styles/Admin.module.css";
import {useEffect, useRef, useState} from "react";


export default function PreviewImage(props) {

  const {imageNumber, image, index, deleteImage, selectImage} = props;

  return (
    <div style={{position: 'relative'}}>
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img
        src={image}
        alt={'Dieses Bild mag ich nicht'}
        className={styles.previewImage}
        style={imageNumber === index ? {
          border: '3px solid var(--action)',
          padding: 3,
          borderRadius: '1rem',
        } : null}
        onClick={selectImage}
      />
      <div
        className={styles.xButton}
        onClick={deleteImage}
      >&#10005;</div>
    </div>
  )
}
