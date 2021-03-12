const ethers = require("ethers");
const madnessUtils = require("./march-madness-utils");

// env variables
const contractAddress = process.env.ContractAddress;
const ownerAddress = process.env.OwnerAddress;

// The Contract interface
const abi = require("../artifacts/contracts/associated-press/MarchMadness2021.sol/MarchMadness2021.json").abi;

const mutate = false;

async function main() {

    // const accounts = await hre.ethers.provider.listAccounts();
    // console.log(accounts);

    const signers = await hre.ethers.getSigners();
    const signer = signers.filter(s => s.address.toLowerCase() === ownerAddress.toLowerCase()).pop();

    const contract = new hre.ethers.Contract(contractAddress, abi, signer);

    const ipfsHash = await contract.ipfsFullData();
    const ipfsData = await ethers.utils.fetchJson(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
    let allGames = madnessUtils.GetAllBrackets(ipfsData.tournament);
    console.log("ipfsHash", ipfsHash);


    let existingGames =(await madnessUtils.GetAllGamesFromContract(allGames, contract)).map(g => madnessUtils.ConvertToGameObject(g));
    let existingGamesIds = existingGames.map(g => g.id);
    console.log("existingGamesIds", existingGamesIds.length);

    // add newly called games
    const newGames = allGames.filter(g =>
        !existingGamesIds.includes(g.id)
        && g.status === "closed"
        && g.home.id
        && g.away.id
        && g.home_points
        && g.away_points
    );
    console.log("newGamesIds", newGames.map(g => g.id), newGames.length);

    if (newGames.length) {
        for (let game of newGames) {

            // console.log('game', game);
            const gameParams = madnessUtils.GetCreateParams(game);
            console.log('gameParams', gameParams);

            mutate && await contract.callWinner(
                gameParams.round,
                gameParams.id,
                gameParams.homeTeam,
                gameParams.awayTeam,
                gameParams.winner,
                gameParams.homePoints,
                gameParams.awayPoints,
                gameParams.scheduled
            );
        }
    } else {
        console.log("no newly called games!")
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
