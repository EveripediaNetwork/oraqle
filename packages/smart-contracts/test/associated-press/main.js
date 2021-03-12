const {expect} = require("chai");

const mockPosition = "test-position";
const mockName = "test-name";

// describe("Jan2021SenateRunoffs", function () {
// 	it("Should return the new Senate result once it's changed", async function () {
// 		const Jan2021SenateRunoffs = await ethers.getContractFactory(
// 			"Jan2021SenateRunoffs"
// 		);
// 		const jan2021SenateRunoffs = await Jan2021SenateRunoffs.deploy();
//
// 		await jan2021SenateRunoffs.deployed();
// 		expect(await jan2021SenateRunoffs.winners(mockPosition)).to.equal("");
//
// 		await jan2021SenateRunoffs.setWinner(mockPosition, mockName);
// 		expect(await jan2021SenateRunoffs.winners(mockPosition)).to.equal(mockName);
// 	});
// });
//
// describe("SuperBowlLV", function () {
// 	it("Should return the new SuperBowlLV result once it's changed", async function () {
// 		const SuperBowlLV = await ethers.getContractFactory(
// 			"SuperBowlLV"
// 		);
// 		const superBowlLV = await SuperBowlLV.deploy();
//
// 		await superBowlLV.deployed();
// 		expect(await superBowlLV.winner()).to.equal("");
//
// 		await superBowlLV.setWinner(mockName);
// 		expect(await superBowlLV.winner()).to.equal(mockName);
// 	});
// });

const convertToGameObject = (g) => ({
    id: g[0],
    homeTeam: g[1],
    awayTeam: g[2],
    winner: g[3].toNumber() === 1 ? g[1] : g[3].toNumber() === 2 ? g[2] : '',
    homePoints: g[4].toNumber(),
    awayPoints: g[5].toNumber(),
    scheduled: g[6].toNumber(),
    closed: g[3].toNumber() > 0,
    round: g[7].toNumber(),
});

describe("MarchMadnes IPFS Data", function () {
    it("Should return the new MarchMadness2021 ipfsHash", async function () {
        const MarchMadness2021 = await ethers.getContractFactory(
            "MarchMadness2021"
        );
        const marchMadness2021 = await MarchMadness2021.deploy();

        await marchMadness2021.setIpfsData('QmNNu842EzMzMDqKUQAXZ7qtQ9FrriWgNPdXKPJzu1gtvN');

        expect(await marchMadness2021.ipfsFullData() === 'QmNNu842EzMzMDqKUQAXZ7qtQ9FrriWgNPdXKPJzu1gtvN');

    });
});

describe("MarchMadness Mutations", function () {
    it("Should return the new MarchMadness2021 closed game.", async function () {
        const MarchMadness2021 = await ethers.getContractFactory(
            "MarchMadness2021"
        );
        const marchMadness2021 = await MarchMadness2021.deploy();

        await marchMadness2021.callWinner(
            0,
            "b4fcb86f-fdce-4044-ae72-3ea5f7b81e43",
            "BEL",
            "TEM",
            1,
            81,
            70,
            1553044500
        );

        const changedGame_1 = convertToGameObject(await marchMadness2021.getGame("b4fcb86f-fdce-4044-ae72-3ea5f7b81e43"));
        expect(changedGame_1.scheduled).to.equal(1553044500);
        expect(changedGame_1.winner).to.equal("BEL");
        expect(changedGame_1.homePoints).to.equal(81);
        expect(changedGame_1.awayPoints).to.equal(70);
        expect(changedGame_1.closed).to.equal(true);
    });
});
