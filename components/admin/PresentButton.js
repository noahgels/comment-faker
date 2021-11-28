import styles from "../../styles/Admin.module.css";


export default function PresentButton(props) {

  const { presented, title, name, socket } = props

  return (
    <button
      className={styles.checkbox}
      onClick={() => socket.emit('presented', name)}
      style={{
        backgroundColor: presented === name ? 'var(--green)' : 'var(--red)',
      }}
    >
      {title}
    </button>
  )
}
