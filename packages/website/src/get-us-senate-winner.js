// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const ethers = require("ethers");

const addresses = {
  kovan: "0x0792724900B551d200D954a5Ed709d9514d73A9F",
  mainnet: "0x3E961f9A77146F6230709D767d60025f1Ed3Bfef",
};

const infuraAPIKeys = {
  kovan: process.env.KOVAN_INFURA,
  mainnet: process.env.MAINNET_INFURA,
};

// The Contract interface
const abi = require("oraqle-contracts/artifacts/contracts/associated-press/Jan2021SenateRunoffs.sol/Jan2021SenateRunoffs.json")
  .abi;

const getUSSenateWinner = async (
  network,
  position /* "U.S. Senate Class II" */
) => {
  const provider = ethers.getDefaultProvider(network);
  // const provider = new ethers.providers.JsonRpcProvider(infuraAPIKeys[network]);
  const contractAddress = addresses[network];
  let contract = new ethers.Contract(contractAddress, abi, provider);
  const winnerLastName = await contract.winners(position);
  return winnerLastName;
};

export default getUSSenateWinner;
