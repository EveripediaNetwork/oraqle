const ethers = require("ethers");

const addresses = {
    rinkeby_2019: "0x42248e07c70893009e903a9ec23efe060ef33dca",
    rinkeby_2021: "0x6a74ccd0c97de8762986adc557afad48d0483500",
    mainnet_2021: "0x17BaF6781EE3b0BBcDffD1e2A78D8C0b40c9A77D",
    bsc_2021: "0x40ba0fea512edab206423a97fa7ec329e0ded551",
    matic_2021: "0x40ba0fea512edab206423a97fa7ec329e0ded551",
    bsc_testnet_2021: "0x2a0E75cA2658160229839500f35f175c3d2c731E",
    matic_testnet_2021: "0x2a0E75cA2658160229839500f35f175c3d2c731E"
};

const infuraAPIKeys = {
    kovan: process.env.KOVAN_INFURA,
    rinkeby: process.env.RINKEBY_INFURA,
    mainnet: process.env.MAINNET_INFURA,
    bsc: "https://bsc-dataseed.binance.org",
    matic: "https://rpc-mainnet.maticvigil.com",
    bsc_testnet: "https://data-seed-prebsc-1-s1.binance.org:8545",
    matic_testnet: "https://rpc-mumbai.maticvigil.com"
};

const getMarchMadnessData = async (
    network, year
) => {
    const abi = [{
        "inputs": [],
        "name": "ipfsFullData",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }];

    const contractAddress = addresses[`${network}_${year}`];
    const provider = new ethers.providers.JsonRpcProvider(infuraAPIKeys[network]);
    let contract = new ethers.Contract(contractAddress, abi, provider);
    const ipfsHash = await contract.ipfsFullData();
    return {
        ipfsHash: ipfsHash,
        contractAddress: addresses[`${network}_${year}`],
        infuraUrl: network === "mainnet" ?
            "https://mainnet.infura.io/v3/<INFURA_API_KEY>" :
            network.startsWith("rinkeby") ? "https://rinkeby.infura.io/v3/<INFURA_API_KEY>" :
                network === "bsc" ? "https://bsc-dataseed.binance.org" :
                    network === "matic" ? "https://rpc-mainnet.maticvigil.com" :
                        network === "bsc_testnet" ? "https://data-seed-prebsc-1-s1.binance.org:8545" :
                            network === "matic_testnet" ? "https://rpc-mumbai.maticvigil.com" : "",
        network: network
    }
};

export default getMarchMadnessData;
