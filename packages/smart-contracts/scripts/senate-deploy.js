const hre = require("hardhat");

async function main() {
	const Jan2021SenateRunoffs = await hre.ethers.getContractFactory(
		"Jan2021SenateRunoffs"
	);
	const jan2021SenateRunoffs = await Jan2021SenateRunoffs.deploy();

	await jan2021SenateRunoffs.deployed();

	console.log(
		"Jan2021SenateRunoffs deployed to:",
		jan2021SenateRunoffs.address
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
