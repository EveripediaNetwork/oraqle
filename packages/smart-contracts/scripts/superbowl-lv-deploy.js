const hre = require("hardhat");

async function main() {
	const SuperBowlLV = await hre.ethers.getContractFactory(
		"SuperBowlLV"
	);
	const superBowlLV = await SuperBowlLV.deploy();

	await superBowlLV.deployed();

	console.log(
		"SuperBowlLV deployed to:",
		superBowlLV.address
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
