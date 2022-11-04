import Link from "next/link";
import getUSSenateWinner from "../../../src/get-us-senate-winner";
import styles from "../../../styles/Home.module.css";

const positions = ["U.S. Senate Class II", "U.S. Senate Class III"];
const affiliations = {
  Perdue: "republican",
  Loeffler: "republican",
  Ossoff: "democrat",
  Warnock: "democrat",
};
const network = "mainnet";
export async function getServerSideProps() {
  const winners = await Promise.all(
    positions.map((position) => getUSSenateWinner(network, position))
  );
  return {
    props: {
      winners,
    }, // will be passed to the page component as props
  };
}

export default function Index({ winners }) {
  return <Senate network={network} winners={winners} />;
}

export function Senate({ network, winners }) {
  const isMainnet = network === "mainnet";
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          January 5th{" "}
          <a
            target="_blank"
            href="https://everipedia.org/blog/us-senate-election-calls-to-be-verified-on-chain-by-everipedia-and-ap"
          >
            Senate Runoff
          </a>
        </h1>

        <p className={styles.description}>
          This data is read directly from the{" "}
          <code className={styles.code}>
            <b>{network}</b> Ethereum
          </code>{" "}
          blockchain
        </p>
        {network === "mainnet" ? (
          <a
            style={{ textDecoration: "underline" }}
            href="https://etherscan.io/address/0x3E961f9A77146F6230709D767d60025f1Ed3Bfef"
          >
            <p className={styles.description}>
              Pulled from
              <code className={styles.code}>0x3E96...Bfef</code>
            </p>
          </a>
        ) : (
          <a
            style={{ textDecoration: "underline" }}
            href="https://kovan.etherscan.io/address/0x0792724900B551d200D954a5Ed709d9514d73A9F"
          >
            <p className={styles.description}>
              Pulled from
              <code className={styles.code}>0x0792...3A9F</code>
            </p>
          </a>
        )}

        <div className={styles.grid}>
          <div className={`${styles.card} ${styles[affiliations[winners[0]]]}`}>
            <h3>{positions[0]}</h3>
            <p>{winners[0] || "Not yet called"}</p>
          </div>

          <div className={`${styles.card} ${styles[affiliations[winners[1]]]}`}>
            <h3>{positions[1]}&rarr;</h3>
            <p>{winners[1] || "Not yet called"}</p>
          </div>

          <Link href={isMainnet ? "./jan-2021-senate/kovan" : "./"}>
            <a className={styles.card}>
              <h3>View {isMainnet ? "Kovan Testnet" : "Mainnet"} &rarr;</h3>
              <p>
                View what this dashboard might look like after race calls
                arrive.
              </p>
            </a>
          </Link>
          <a
            href="https://docs.everipedia.org/current-oraqles-projects/jan-5-2021"
            className={styles.card}
            target="_blank"
          >
            <h3>Docs &rarr;</h3>
            <p>Discover how to use this data in software applications.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://braindao.org">
          Powered by the Associated Press and BrainDAO
        </a>
      </footer>
    </div>
  );
}
