global.fetch = require("node-fetch");

export default async function handler(req, res) {
    const ipfsHash = req.query.hash;
    const data = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`).then(r => r.json());
    const statistics = await fetch(`https://gateway.pinata.cloud/ipfs/${data.statistics_hash}`).then(r => r.json());
    res.status(200).json({
        tournament: data.tournament,
        statistics
    });
};
