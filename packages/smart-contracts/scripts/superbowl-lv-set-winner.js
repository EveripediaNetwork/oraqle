const hre = require("hardhat");

const winningTeam = "Buccaneers";

// deployed address
const contractAddress = "0xEa4D2Ce80Ab235705c0Ca445D07AA64d618F29AC"; // kovan
// const contractAddress = "0x21bBaf61250342865487D96322140738414142B2"; // mainnet
const abi = require("../artifacts/contracts/associated-press/SuperBowlLV.sol/SuperBowlLV.json").abi;
const ownerAddress = "0x436ee8cb3a351893b77f8b57c9772daec3a96445";

async function main() {

    // Retrieve accounts
    const accounts = await hre.ethers.provider.listAccounts();
    console.log(accounts);

    const signers = await hre.ethers.getSigners();
    const signer = signers.filter(s => s.address.toLowerCase() === ownerAddress.toLowerCase()).pop();

    const contract = new hre.ethers.Contract(contractAddress, abi, signer);

    // console.log(await contract.setWinner(winningTeam));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
