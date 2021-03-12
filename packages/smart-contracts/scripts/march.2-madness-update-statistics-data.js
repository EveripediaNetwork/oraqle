const fs = require('fs');
const ethers = require("ethers");
const pinataSDK = require("@pinata/sdk");
var jsonDiff = require("json-diff");
const madnessUtils = require("./march-madness-utils");

// env variables & variables
const contractAddress = process.env.ContractAddress;
const ownerAddress = process.env.OwnerAddress;
const pinataApiKey = process.env.PinataApiKey;
const pinataSecretApiKey = process.env.PinataSecretApiKey;
const sportradarApiKey = process.env.SportradarApiKey;
const tournamentId = "6b1b9057-68b6-4705-9642-0d5e5f2c9dd1"; // sportradar tournament id

const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

// The Contract interface
const abi = require("../artifacts/contracts/associated-press/MarchMadness2021.sol/MarchMadness2021.json").abi;

// flags
const pin = true; // pin ipfs

async function main() {

    const signers = await hre.ethers.getSigners();
    const signer = signers.filter(s => s.address.toLowerCase() === ownerAddress.toLowerCase()).pop();

    const contract = new hre.ethers.Contract(contractAddress, abi, signer);

    // get latest tournament results
    const sportradarData = await ethers.utils.fetchJson(`https://api.sportradar.us/ncaamb-t3/tournaments/${tournamentId}/schedule.json?api_key=${sportradarApiKey}`);
    const sportradarAllGames = madnessUtils.GetAllBrackets(sportradarData);

    // games in the contract
    const ipfsHash = await contract.ipfsFullData();
    const ipfsData = ipfsHash ?
        await ethers.utils.fetchJson(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
        : {
            tournament: {},
            statistics_hash: ''
        };
    const ipfsStatisticsData = ipfsData.statistics_hash && ipfsData.statistics_hash.length ?
        await ethers.utils.fetchJson(`https://gateway.pinata.cloud/ipfs/${ipfsData.statistics_hash}`) : {};
    let contractAllGames = Object.entries(ipfsData.tournament).length === 0 ?
        [] : madnessUtils.GetAllBrackets(ipfsData.tournament);
    const contractAllGamesIds = contractAllGames.map(g => g.id);
    const findContractGame = (id) => contractAllGames.find(g => g.id === id);

    console.log("tournament data ipfsHash", ipfsHash);
    console.log("game statistics ipfsHash", ipfsData.statistics_hash);

    // newly closed games, we need to update the team stats for these
    const newGamesNeedStats = sportradarAllGames.filter(g =>
        (contractAllGamesIds.length === 0 ||
            (contractAllGamesIds.includes(g.id) && findContractGame(g.id).status !== "closed")
        )
        && g.status === "closed"
        && g.home.id
        && g.away.id
        && g.home_points
        && g.away_points
    );

    console.log("newGamesNeedStats", newGamesNeedStats.length);

    // unique teamIds
    const allTeamIds = [...new Set([
        ...newGamesNeedStats.map(g => g.home.id),
        ...newGamesNeedStats.map(g => g.away.id)
    ])].filter(id => id); // nulls
    console.log(allTeamIds);

    const sportRadarGameStats = await madnessUtils.SportRadarGameStatistics(
        ethers.utils.fetchJson,
        tournamentId,
        allTeamIds,
        sportradarApiKey
    );

    console.log(jsonDiff.diffString(ipfsStatisticsData, sportRadarGameStats))

    if (pin) {

        for (let teamId of Object.keys(sportRadarGameStats)) {
            ipfsStatisticsData[teamId] = sportRadarGameStats[teamId]
        }

        const options = {
            pinataMetadata: {
                name: `game-statistics-2021-${hre.network.name}`,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const pinResult = await pinata.pinJSONToIPFS(ipfsStatisticsData, options);

        console.log(pinResult);

        fs.writeFileSync(
            `./scripts/data/${pinResult.IpfsHash}.json`,
            JSON.stringify(ipfsStatisticsData, null, 4)
        );
        console.log("JSON data is saved.");
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
