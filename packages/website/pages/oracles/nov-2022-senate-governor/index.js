import { useState } from "react";
import {addresses, getAllGovernors, getAllSenators} from "../../../src/nov82022";
import styles from "../../../styles/Home.module.css";

export async function getServerSideProps(context) {
  const network = context.query.network
  
  const winnerSenators =  await getAllSenators(network)
  const winnerGovernors = await getAllGovernors(network)

  return {
    props: {
      winnerSenators,
      winnerGovernors,
      network
    },
  };
}

export default function Index({ winnerSenators, winnerGovernors, network }) {
  return <SenateGovernors network={network} winnerSenators={winnerSenators} winnerGovernors={winnerGovernors} />;
}

export function SenateGovernors({ network, winnerSenators, winnerGovernors }) {
  const isMatic = network === "matic";
  const [explorerUrl] = useState(isMatic ? `https://polygonscan.io/address/${addresses[network]}` : `https://bscscan.com/address/${addresses[network]}`)

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          November 8th{" "}
          <a
            target="_blank"
            href=""
          >
            Senate & Governor&nbsp;
          </a>
          elections
        </h1>

        <p className={styles.description}>
          This data is read directly from the{" "}
          <code className={styles.code}>
            <b>{network}</b>
          </code>{" "}
          blockchain
        </p>
        <a
          style={{ textDecoration: "underline" }}
          href={explorerUrl}
        >
          <p className={styles.description}>
            Pulled from
            <code className={styles.code}>{addresses[network].substring(0, 8)}</code>
          </p>
        </a>
        <a
          style={{ textDecoration: "underline" }}
          href={`/oracles/nov-2022-senate-governor?network=${network === "matic" ? "bsc" : "matic"}`}
        >
          <p className={styles.description}>
            Swicth to {network === "matic" ? "BSC" : "Matic"}
          </p>
        </a>

        <div className={styles.grid} style={{minWidth: "90%"}}>

          <div className={styles.customCard}>
            <h4 className={styles.customCardTitle}>Winner Senators</h4>
            <hr />
            <ul className={styles.list}>
              {winnerSenators.map(s => (
                <>
                  {
                    s.senators.length > 0 ? (
                      <li key={s.state}>
                        <h6 className={styles.customCardTitle}>{s.state}</h6>
                        {s.senators.map(fullname => 
                          <ul className={styles.list}>
                            <li key={fullname}>{fullname}</li>
                          </ul>
                        )}
                      </li>
                    ) : null
                  }
                </>
              ))}
            </ul>
          </div>
          <div className={styles.customCard}>
            <h4 className={styles.customCardTitle}>Winner Governors</h4>
            <hr />
            <ul className={styles.list}>
              {winnerGovernors.map(g => (
                <>
                  {g.governor !== null ? (
                    <li key={g.state}>
                      <h6 className={styles.customCardTitle}>{g.state}</h6>
                      {g.governor}
                    </li>
                  ): null}
                </>
              ))}
            </ul>
          </div>
        </div>

      </main>

      <footer className={styles.footer}>
        <a href="https://braindao.org">
          Powered BrainDAO and Associated press
        </a>
      </footer>
    </div>
  );
}
