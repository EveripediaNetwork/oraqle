import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Everipedia OraQles</h1>

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        <div className={styles.grid}>

          <Link href="/oracles/superbowl-lv">
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h3>February 7th, 2021 Super Bowl LV &rarr;</h3>
              <p>
                Associated Press and Everipedia partner again to bring the
                Super Bowl LV Results on-chain!
              </p>
              {/* <p>Find in-depth information about Next.js features and API.</p> */}
            </a>
          </Link>

          <Link href="/oracles/jan-2021-senate">
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h3>January 5th, 2021 Senate Runoff &rarr;</h3>
              <p>
                Associated Press and Everipedia partner again to bring the
                Georgia senate runoff on-chain!
              </p>
              {/* <p>Find in-depth information about Next.js features and API.</p> */}
            </a>
          </Link>

          <a
            href="https://everipedia.org/oraqle/ap/eth"
            className={styles.card}
          >
            <h3>November 3rd, 2021 Election &rarr;</h3>
            <p>
              Associated Press and Everipedia brought the U.S. election
              on-chain!
            </p>
          </a>

          {/* <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a> */}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://everipedia.org">Powered by Everipedia</a>
      </footer>
    </div>
  );
}
