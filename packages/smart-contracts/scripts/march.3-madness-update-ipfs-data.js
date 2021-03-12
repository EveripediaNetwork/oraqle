const ethers = require("ethers");
const pinataSDK = require("@pinata/sdk");
var jsonDiff = require("json-diff");

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
const pin = false; // pin ipfs
const updateContractHash = false; // update the contract with ipfs hash
const outputDiff = false; // output the data diff

async function main() {

    const signers = await hre.ethers.getSigners();
    const signer = signers.filter(s => s.address.toLowerCase() === ownerAddress.toLowerCase()).pop();

    const contract = new hre.ethers.Contract(contractAddress, abi, signer);

    // get statistics ipfs hash
    const existingStats = (await pinata.pinList({
        status: "pinned",
        metadata: {
            name: `game-statistics-2021-${hre.network.name}`
        }
    })).rows.sort((a, b) => new Date(a.date_pinned) < new Date(b.date_pinned) ? 1 : -1);

    console.log("existingStats", existingStats);

    const statsHash = existingStats && existingStats.length > 0 ? existingStats[0].ipfs_pin_hash : "";

    const sportradarData = {
        tournament: await ethers.utils.fetchJson(
            `https://api.sportradar.us/ncaamb-t3/tournaments/${tournamentId}/schedule.json?api_key=${sportradarApiKey}`
        ),
        statistics_hash: statsHash // hash to the game statistics
    };

    const ipfsHash = await contract.ipfsFullData();
    const ipfsData = ipfsHash ?
        await ethers.utils.fetchJson(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
        : {
            tournament: {},
            statistics_hash: statsHash
        };


    const diff = jsonDiff.diffString(ipfsData.tournament, sportradarData);

    if (!diff.length) {
        console.log('existing contract contains the latest data!');
        return;
    }

    if (outputDiff) {
        console.log(diff);
    }

    if (pin || updateContractHash) {
        console.log("Current IpfsHash", ipfsHash);

        if (pin) {
            const options = {
                pinataMetadata: {
                    name: `march-madness-tournament-2021-${hre.network.name}`,
                },
                pinataOptions: {
                    cidVersion: 0
                }
            };
            const pinResult = await pinata.pinJSONToIPFS(sportradarData, options)

            console.log("New IpfsHash", pinResult.IpfsHash);

            updateContractHash && console.log(await contract.setIpfsData(pinResult.IpfsHash));
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
