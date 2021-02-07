import { SuperBowlLVWinner } from "./";
import getSuperbowlLVWinner from "../../../src/get-superbowl-lv-winner";

const network = "kovan";
export async function getServerSideProps() {
    const winningTeam = await getSuperbowlLVWinner(network,);

    return {
        props: {
            winningTeam,
        }, // will be passed to the page component as props
    };
}

export default function Index({ winningTeam }) {
    return <SuperBowlLVWinner network={network} winningTeam={winningTeam} />;
}
