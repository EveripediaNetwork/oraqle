const { expect } = require("chai");

describe("Jan2021SenateRunoffs example consumer", function () {
  it("Should connect to kovan contract remotely and know that Perdue was set as winner", async function () {
    const IsPerdueWinner = await ethers.getContractFactory("IsPerdueWinner");
    const isPerdueWinner = await IsPerdueWinner.deploy();

    await isPerdueWinner.deployed();
    expect(await isPerdueWinner.isPerdueWinner()).to.be.true;
  });
});
