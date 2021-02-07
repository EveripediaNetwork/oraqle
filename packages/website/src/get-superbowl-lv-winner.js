// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const ethers = require("ethers");

const addresses = {
    kovan: "0xEa4D2Ce80Ab235705c0Ca445D07AA64d618F29AC",
    mainnet: "0x21bBaf61250342865487D96322140738414142B2",
};

const infuraAPIKeys = {
    kovan: process.env.KOVAN_INFURA,
    mainnet: process.env.MAINNET_INFURA,
};

// The Contract interface
const abi = require("./oraqle-contracts/artifacts/contracts/associated-press/SuperBowlLV.sol/SuperBowlLV.json").abi;

const getSuperbowlLVWinner = async (
    network
) => {
    // const provider = ethers.getDefaultProvider(network);
    const provider = new ethers.providers.JsonRpcProvider(infuraAPIKeys[network]);
    const contractAddress = addresses[network];
    let contract = new ethers.Contract(contractAddress, abi, provider);
    return await contract.winner();
};

export default getSuperbowlLVWinner;
