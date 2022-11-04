import React from "react";
import MarchMadnessComponent from "./index"
import getMarchMadnessData from "../../../src/get-march-madness";

const network = "matic_testnet";
const year = 2021;

export async function getServerSideProps({query}) {
    const view = query.view;

    console.log('loading start');
    const contractData = await getMarchMadnessData(network, year);
    console.log('loading done');
    return {
        props: {
            contractData,
            view: view || "bracket"
        }, // will be passed to the page component as props
    };
}

export default function Index(props) {
    return <MarchMadnessComponent {...props} yearIn={year}/>
}
