const hre = require("hardhat");

const privateKey = process.env.PRIVATE_KEY;

const position = "U.S. Senate Class III";
const lastName = "Warnock";

// deployed kovan address
const contractAddress = "0x0792724900B551d200D954a5Ed709d9514d73A9F";
const abi = require("../artifacts/contracts/associated-press/Jan2021SenateRunoffs.sol/Jan2021SenateRunoffs.json")
  .abi;
const provider = hre.ethers.getDefaultProvider("kovan");
const wallet = new ethers.Wallet(privateKey, provider);

async function main() {
  const contract = new hre.ethers.Contract(contractAddress, abi, wallet);

  console.log(await contract.setWinner(position, lastName));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
