const ethers = require("ethers");
const contractAddress = "0xEa4D2Ce80Ab235705c0Ca445D07AA64d618F29AC"; // kovan
// const contractAddress = "0x21bBaf61250342865487D96322140738414142B2"; // mainnet

// The Contract interface

const abi = require("../artifacts/contracts/associated-press/SuperBowlLV.sol/SuperBowlLV.json").abi;


// Connect to the network
let provider = ethers.getDefaultProvider("kovan");

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
let contract = new ethers.Contract(contractAddress, abi, provider);

async function main() {
  console.log(await contract.winner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
