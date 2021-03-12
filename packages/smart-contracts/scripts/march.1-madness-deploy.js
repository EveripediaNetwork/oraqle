const hre = require("hardhat");

async function main() {
	const MarchMadness2021 = await hre.ethers.getContractFactory(
		"MarchMadness2021"
	);
	const marchMadness2021 = await MarchMadness2021.deploy();

	await marchMadness2021.deployed();

	console.log(
		"MarchMadness2021 deployed to:",
		marchMadness2021.address,
		marchMadness2021
	);

	console.log(
		"Signer:",
		await marchMadness2021.signer.getAddress()
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
