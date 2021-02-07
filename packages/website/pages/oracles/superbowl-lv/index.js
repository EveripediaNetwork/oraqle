import Link from "next/link";
import getSuperbowlLVWinner from "../../../src/get-superbowl-lv-winner";
import styles from "../../../styles/Home.module.css";

const network = "mainnet";
export async function getServerSideProps() {
    const winningTeam = await getSuperbowlLVWinner(network);
    return {
        props: {
            winningTeam,
        }, // will be passed to the page component as props
    };
}

export default function Index({ winningTeam }) {
    return <SuperBowlLVWinner network={network} winningTeam={winningTeam} />;
}

export function SuperBowlLVWinner({ network, winningTeam }) {
    const isMainnet = network === "mainnet";
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    February 7th{" "}Super Bowl LV
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
                        href="https://etherscan.io/address/0x21bBaf61250342865487D96322140738414142B2"
                    >
                        <p className={styles.description}>
                            Pulled from
                            <code className={styles.code}>0x21bB...42B2</code>
                        </p>
                    </a>
                ) : (
                    <a
                        style={{ textDecoration: "underline" }}
                        href="https://kovan.etherscan.io/address/0xEa4D2Ce80Ab235705c0Ca445D07AA64d618F29AC"
                    >
                        <p className={styles.description}>
                            Pulled from
                            <code className={styles.code}>0xEa4D...29AC</code>
                        </p>
                    </a>
                )}

                <div className={styles.grid}>
                    <div className={`${styles.card} ${styles[winningTeam]}`}>
                        <p>{winningTeam || "Not yet called"}</p>
                    </div>

                    <Link href={isMainnet ? "./superbowl-lv/kovan" : "./"}>
                        <a className={styles.card}>
                            <h3>View {isMainnet ? "Kovan Testnet" : "Mainnet"} &rarr;</h3>
                            <p>
                                View what this dashboard might look like after race calls
                                arrive.
                            </p>
                        </a>
                    </Link>
                    {/*<a*/}
                    {/*    href="https://docs.everipedia.org/current-oraqles-projects/jan-5-2021"*/}
                    {/*    className={styles.card}*/}
                    {/*    target="_blank"*/}
                    {/*>*/}
                    {/*    <h3>Docs &rarr;</h3>*/}
                    {/*    <p>Discover how to use this data in software applications.</p>*/}
                    {/*</a>*/}
                </div>
            </main>

            <footer className={styles.footer}>
                <a href="https://everipedia.org">
                    Powered by the Associated Press and Everipedia
                </a>
            </footer>
        </div>
    );
}
