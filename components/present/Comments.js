import styles from '../../styles/present/Comments.module.css'
import {useState} from "react";

export default function Comments(props) {

  const { comments } = props;
  const [commentIndex, setCommentIndex] = useState(0);

  const upperCommentIndex = Math.max(0, commentIndex - 1);
  const lowerCommentIndex = Math.min(comments.length - 1, commentIndex + 1);

  return (
    <main className={styles.main}>
      {comments ? comments.map((comment, index) => {
        return (
          <div
            id={'comment' + index}
            key={comment + index}
            className={styles.comment}
          >
            &#8222;{comment}&#8221;
          </div>
        )
      }) : null}
      <a
        href={'#comment' + upperCommentIndex}
        onClick={() => setTimeout(() => {
          setCommentIndex(upperCommentIndex)
        }, 100)}
        className={styles.scrollUp}
      />
      <a
        href={'#comment' + lowerCommentIndex}
        onClick={() => setTimeout(() => {
          setCommentIndex(lowerCommentIndex)
        }, 100)}
        className={styles.scrollDown}
      />
    </main>
  )
}
