import Head from 'next/head';
import styles from '../styles/About.module.css';

export default function About() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Impressum - Kommentarcheck</title>
      </Head>
      <main className={styles.main}>
        <h1>Impressum</h1>

        <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
        <p>Noah Gels<br />
          Wespenweg 16<br />
          49811 Lingen</p>

        <h2>Kontakt</h2>
        <p>Telefon: 017671295880<br />
          E-Mail: noah.gels@noahgels.com</p>

        <p>Quelle: <a href="https://www.e-recht24.de">eRecht24</a></p>
      </main>
    </div>
  )
}
