const { expect } = require("chai");

const mockPosition = "test-position";
const mockName = "test-name";

describe("Jan2021SenateRunoffs", function () {
	it("Should return the new Senate result once it's changed", async function () {
		const Jan2021SenateRunoffs = await ethers.getContractFactory(
			"Jan2021SenateRunoffs"
		);
		const jan2021SenateRunoffs = await Jan2021SenateRunoffs.deploy();

		await jan2021SenateRunoffs.deployed();
		expect(await jan2021SenateRunoffs.winners(mockPosition)).to.equal("");

		await jan2021SenateRunoffs.setWinner(mockPosition, mockName);
		expect(await jan2021SenateRunoffs.winners(mockPosition)).to.equal(mockName);
	});
});

describe("SuperBowlLV", function () {
	it("Should return the new SuperBowlLV result once it's changed", async function () {
		const SuperBowlLV = await ethers.getContractFactory(
			"SuperBowlLV"
		);
		const superBowlLV = await SuperBowlLV.deploy();

		await superBowlLV.deployed();
		expect(await superBowlLV.winner()).to.equal("");

		await superBowlLV.setWinner(mockName);
		expect(await superBowlLV.winner()).to.equal(mockName);
	});
});
