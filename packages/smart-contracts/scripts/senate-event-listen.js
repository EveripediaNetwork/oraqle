const hre = require("hardhat");

const privateKey = `0x${process.env.PRIVATE_KEY}`;

// const contractAddress = "0xA9A23a155817bF0de8207d01e24e856E581CB876";
const abi = require("../artifacts/contracts/Jan2021SenateRunoffs.sol/Jan2021SenateRunoffs.json")
	.abi;
const provider = hre.ethers.getDefaultProvider("kovan");
const wallet = new ethers.Wallet(privateKey, provider);

async function main() {
	const contract = new hre.ethers.Contract(contractAddress, abi, wallet);

	return new Promise((res, reject) => {
		contract.on("SetWinner", (position, name) => {
			console.log(`AP called position "${position}" to "${name}"`);
			return Promise.resolve();
		});
	});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
