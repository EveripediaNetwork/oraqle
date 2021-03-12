const regions = ["South Regional", "East Regional", "West Regional", "Midwest Regional"];

function GetGamesInOrder(games) {
    return games.sort((a, b) => Number(a.title.match("Game ([0-9]+)")[1]) > Number(b.title.match("Game ([0-9]+)")[1]) ? 1 : -1);
}

function GetBracketsInOrder(round, brackets) {

    let allGames = [];

    for (const region of regions) {
        const region_bracket = brackets.find(b => b.bracket.name === region);
        if (!region_bracket) {
            continue;
        }
        allGames = allGames.concat(GetGamesInOrder(region_bracket.games));
    }

    return allGames;
}

function GetAllBrackets(data) {
    const firstFour = GetBracketsInOrder(0, data.rounds.find(r => r.sequence === 1).bracketed);
    firstFour.forEach(g => g.round = 0);
    const firstRound = GetBracketsInOrder(1, data.rounds.find(r => r.sequence === 2).bracketed);
    firstRound.forEach(g => g.round = 1);
    const secondRound = GetBracketsInOrder(2, data.rounds.find(r => r.sequence === 3).bracketed);
    secondRound.forEach(g => g.round = 2);
    const sweet16 = GetBracketsInOrder(3, data.rounds.find(r => r.sequence === 4).bracketed);
    sweet16.forEach(g => g.round = 3);
    const eliteEight = GetBracketsInOrder(4, data.rounds.find(r => r.sequence === 5).bracketed);
    eliteEight.forEach(g => g.round = 4);
    const finalFour = data.rounds.find(r => r.sequence === 6).games;
    finalFour.forEach(g => g.round = 5);
    const nationalChampionship = data.rounds.find(r => r.sequence === 7).games;
    nationalChampionship.forEach(g => g.round = 6);

    return [
        ...firstFour,
        ...firstRound,
        ...secondRound,
        ...sweet16,
        ...eliteEight,
        ...finalFour,
        ...nationalChampionship]
}

function GetCreateParams(game) {
    return {
        id: game.id,
        homeTeam: game.home.alias,
        awayTeam: game.away.alias,
        winner: game.home_points > game.away_points ? 1 : 2,
        homePoints: game.home_points,
        awayPoints: game.away_points,
        scheduled: Math.floor(new Date(game.scheduled).getTime() / 1000),
        round: game.round,

    }
}

function ConvertToGameObject(g) {
    return {
        id: g[0],
        homeTeam: g[1],
        awayTeam: g[2],
        winner: g[3].toNumber() === 1 ? g[1] : g[3].toNumber() === 2 ? g[2] : '',
        homePoints: g[4].toNumber(),
        awayPoints: g[5].toNumber(),
        scheduled: g[6].toNumber(),
        closed: g[3].toNumber() > 0,
        round: g[7].toNumber(),
    };
}

// rate limit
const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function SportRadarGameStatistics(fetchJson, tournamentId, teamIds, apiKey) {
    const getDataForTeam = async (teamId) => {
        const url = `https://api.sportradar.us/ncaamb/trial/v7/en/tournaments/${tournamentId}/teams/${teamId}/statistics.json?api_key=${apiKey}`;
        return await fetchJson(url);
    };
    const result = {};
    for (let tId of teamIds) {
        await sleep(2000);
        result[tId] = await getDataForTeam(tId);
        console.log(tId);

    }
    return result;
}

async function GetAllGamesFromContract(sportData, contract) {
    return (await Promise.all(sportData.map(async g => await contract.getGame(g.id)))).filter(g => g.id !== '');
}

module.exports = {
    GetGamesInOrder,
    GetBracketsInOrder,
    GetAllBrackets,
    GetCreateParams,
    ConvertToGameObject,
    GetAllGamesFromContract,
    SportRadarGameStatistics
};
