import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>IQ OraQles</h1>

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        <div className={styles.grid} style={{gridColumnGap: 0}}>

          <Link href="/oracles/march-madness">
            <a href="" className={styles.card}>
              <h3>March Madness 2021 &rarr;</h3>
              <p>
                Associated Press and BrainDAO partner to bring
                March Madness 2021 Results on-chain!
              </p>
            </a>
          </Link>
          <Link href="/oracles/superbowl-lv">
            <a href="" className={styles.card}>
              <h3>February 7th, 2021 Super Bowl LV &rarr;</h3>
              <p>
                Associated Press and BrainDAO partner again to bring the
                Super Bowl LV Results on-chain!
              </p>
              {/* <p>Find in-depth information about Next.js features and API.</p> */}
            </a>
          </Link>

          <Link href="/oracles/jan-2021-senate">
            <a href="" className={styles.card}>
              <h3>January 5th, 2021 Senate Runoff &rarr;</h3>
              <p>
                Associated Press and BrainDAO partner again to bring the
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
              Associated Press and BrainDAO brought the U.S. election
              on-chain!
            </p>
          </a>

          <a
            href="/oracles/nov-2022-senate-governor?network=matic"
            className={styles.card}
          >
            <h3>November 8th, 2022 Election &rarr;</h3>
            <p>
              Associated Press and BrainDAO brought the U.S. Senate & Governor elections
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
        <a href="https://braindao.org">Powered by BrainDAO</a>
      </footer>
    </div>
  );
}
