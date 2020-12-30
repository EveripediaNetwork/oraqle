import { Senate } from "./";
import getUSSenateWinner from "../../../src/get-us-senate-winner";

const positions = ["U.S. Senate Class II", "U.S. Senate Class III"];
const network = "kovan";
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
