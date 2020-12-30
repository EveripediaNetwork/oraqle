const ethers = require("ethers");
const contractAddress = "0x0792724900B551d200D954a5Ed709d9514d73A9F";

// The Contract interface

const abi = require("../artifacts/contracts/associated-press/Jan2021SenateRunoffs.sol/Jan2021SenateRunoffs.json")
  .abi;

// Connect to the network
let provider = ethers.getDefaultProvider("kovan");

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
let contract = new ethers.Contract(contractAddress, abi, provider);

async function main() {
  console.log(await contract.winners("U.S. Senate Class II"));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
