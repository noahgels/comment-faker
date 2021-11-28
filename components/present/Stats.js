import styles from "../../styles/present/Stats.module.css";

export default function Stats(props) {

  const { showComments, commentingEnabled, commentAmount } = props;

  return (
    <main className={styles.main}>
      <div>
        <h2>
          Kommentare sehen ist{' '}
          <span style={{color: `var(--${showComments ? 'green' : 'red'})`}}>
                        {showComments ? '' : 'de'}aktiviert
            </span>
        </h2>
        <h2>
          Kommentare schreiben ist{' '}
          <span style={{color: `var(--${commentingEnabled ? 'green' : 'red'})`}}>
                        {commentingEnabled ? '' : 'de'}aktiviert
            </span>
        </h2>
      </div>
      <div className={styles.commentAmount}>{commentAmount}</div>
    </main>
  )
}
