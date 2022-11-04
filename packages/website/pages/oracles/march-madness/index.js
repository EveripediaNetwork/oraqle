import Head from "next/head";
import React, {useState, useEffect} from "react";
import {Bracket, Seed, SeedItem, SeedTeam} from 'react-brackets';
import {
    Tab,
    Row,
    Col,
    Nav,
    Jumbotron,
    Badge,
    Accordion,
    Card,
    CardColumns,
    Table,
    DropdownButton,
    Dropdown,
    Spinner, Alert, Tooltip, OverlayTrigger, CardDeck
} from "react-bootstrap";
import {Timeline} from 'react-twitter-widgets'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import getMarchMadnessData from "../../../src/get-march-madness";
import styles from "../../../styles/Home.module.css";
import Link from "next/link";

const network = "mainnet";
const year = 2021;

export async function getServerSideProps({query}) {

    const view = query.view;

    console.log('loading start');
    const contractData = await getMarchMadnessData(network, year);
    console.log('loading done');
    return {
        props: {
            contractData,
            view: view || "bracket"
        }, // will be passed to the page component as props
    };
}

export default function MarchMadnessComponent({contractData, yearIn, view = "bracket"}) {

    if (!yearIn) {
        yearIn = year;
    }

    const [data, setData] = useState({
        loaded: false,
        tournament: {},
        statistics: {},
        ...contractData
    });

    useEffect(async () => {
        const data = await fetch(`${window.location.origin}/api/ipfs/${contractData.ipfsHash}`).then(r => r.json());
        setData(prevState => ({
            ...prevState,
            tournament: data.tournament,
            statistics: data.statistics,
            loaded: true,
        }));
    }, []);


    return <div className={styles.dashboard}>
        <Head>
            <meta property="og:title" content="March Madness 2021 OraQle" key="title"/>
            <meta name="og:image" key="og:image"
                  content={`https://gateway.pinata.cloud/ipfs/QmSYvzgmBQAaX1q3oyV2uVZzcmRn7JDgepFMTzAbemQZnF`}/>
        </Head>
        <Jumbotron>
            <h1 className={styles.title}>
                March Madness OraQle Dashboard
            </h1>
        </Jumbotron>
        {data.loaded && <MarchMadnessViewer data={data} year={yearIn} defaultView={view}/>}
        {!data.loaded && <Spinner animation="grow" variant="primary" className={styles.loader}/>}
    </div>
}

export function MarchMadnessViewer({data, year, defaultView}) {

    const [isRaw, toggleRaw] = useState(false);

    return <Tab.Container id="madness-viewer" defaultActiveKey={defaultView}>
        <Row className={styles.dashboardBody}>
            <Col sm={3} className={styles.navSection}>
                <div className={styles.networkContainer}>Network:
                    <DropdownButton
                        size="sm" id="dropdown-network"
                        title={`${data?.network}${year === 2019 ? "-2019" : ""}`}
                        className={styles.networkSelector}
                    >
                        <Dropdown.Item href="/oracles/march-madness">eth</Dropdown.Item>
                        {/*<Dropdown.Item href="/oracles/march-madness/rinkeby">rinkeby</Dropdown.Item>*/}
                        {/*<Dropdown.Item href="/oracles/march-madness/rinkeby-2019">rinkeby-2019</Dropdown.Item>*/}
                        <Dropdown.Item href="/oracles/march-madness/bsc">bsc</Dropdown.Item>
                        <Dropdown.Item href="/oracles/march-madness/polygon">polygon</Dropdown.Item>
                    </DropdownButton>
                </div>
                <Nav variant="pills" className={`flex-column ${styles.navLinkOverride}`}>
                    <Nav.Item>
                        <Nav.Link eventKey="info">Info</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="bracket">Bracket</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="team-statistics">Team Statistics</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="json">Json{" "}
                            <Badge variant="light" style={{float: "right"}}
                                   onClick={() => toggleRaw(!isRaw)}>
                                {isRaw ? "raw" : "viewer"}
                            </Badge>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="press">Press</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className={styles.twitterWidget}>
                    <Timeline
                        dataSource={{
                            sourceType: 'profile',
                            screenName: 'Everipedia'
                        }}
                        options={{
                            height: '400'
                        }}
                    />
                </div>
            </Col>
            <Col sm={9} className={styles.scrollingViewHeight}>
                <Tab.Content>
                    <Tab.Pane eventKey="info">
                        <Info
                            contractAddress={data.contractAddress}
                            infuraUrl={data.infuraUrl}
                            ipfsHash={data.ipfsHash}
                            network={data.network}
                        />

                    </Tab.Pane>
                    <Tab.Pane eventKey="bracket">
                        {data.tournament && <ReactBrackets data={data?.tournament}/>}
                    </Tab.Pane>
                    <Tab.Pane eventKey="team-statistics">
                        {Object.keys(data?.statistics).length === 0 ?
                            <Alert variant='warning' className={styles.alert}>Check back later</Alert> :
                            <Accordion defaultActiveKey={0}>
                                {Object.values(data?.statistics)
                                    .map((t, i) => <TeamStatsViewer team={t} index={i} key={`teamStatViewer_${i}`}/>)}
                            </Accordion>}
                    </Tab.Pane>
                    <Tab.Pane eventKey="json">
                        <JsonViewer jsonData={data} isRaw={isRaw}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="press">
                        <PressPane/>
                    </Tab.Pane>
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
}

const press_json = [
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fcdn.buttercms.com%2FHLrxn5xQKa4ItpvAbC9K",
        title: "EVERIPEDIA.ORG",
        text: "The Associated Press works with Everipedia to publish March Madness scores on Ethereum | Everipedia Blog",
        link: "https://everipedia.org/blog/the-associated-press-works-with-everipedia-to-publish-march-madness-scores-on-ethereum"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fu.today%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1200x900%2Fpublic%2F2021-03%2FAdobeStock_404621189.jpeg",
        title: "COINMARKETCAP.COM",
        text: "Associated Press to Record Basketball Scores on Ethereum Blockchain | Headlines | News | CoinMarketCap",
        link: "https://coinmarketcap.com/headlines/news/associated-press-to-record-basketball-scores-on-ethereum-blockchain/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Ftokenpost.com%2Fassets%2Fimages%2Ftokenpostcom%2Fcommon%2FsnsShareV3.png",
        title: "TOKENPOST.COM",
        text: "Associated Press To Record Basketball Scores On Ethereum Blockchain - TokenPost",
        link: "https://tokenpost.com/Associated-Press-To-Record-Basketball-Scores-On-Ethereum-Blockchain-7555"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fheraldsheets.com%2Fwp-content%2Fuploads%2F2021%2F03%2FUntitled-design317.jpg",
        title: "HERALDSHEETS.COM",
        text: "Associated Press to Record Basketball Scores on Ethereum in Conjunction with Everipedia - Herald Sheets",
        link: "https://heraldsheets.com/associated-press-to-record-basketball-scores-on-ethereum-with-everipedia/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fwww.worldstockmarket.net%2Fwp-content%2Fuploads%2F2021%2F03%2FAssociated-Press-To-Release-Ethereum-Basketball-Results.jpg",
        title: "WWW.WORLDSTOCKMARKET.NET",
        text: "Associated Press To Release Ethereum Basketball Results - World Stock Market",
        link: "https://www.worldstockmarket.net/associated-press-to-release-ethereum-basketball-results/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fbitcoinexchangeguide.com%2Fwp-content%2Fuploads%2Fogimages%2F284674_1616166135ap-partners-with-everipedia-to-broadcast-ncaas-march-madness-scores-to-ethereums-blockchain.jpg",
        title: "BITCOINEXCHANGEGUIDE.COM",
        text: "AP Partners with Everipedia to Broadcast NCAA's March Madness Scores to Ethereum's Blockchain",
        link: "https://bitcoinexchangeguide.com/ap-partners-with-everipedia-to-broadcast-ncaas-march-madness-scores-to-ethereums-blockchain/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fbits.media%2Fupload%2Fiblock%2Fe6c%2Fassociated_press_opublikuet_rezultaty_basketbolnykh_matchey_v_efiriume.jpg",
        title: "BITS.MEDIA",
        text: "Associated Press опубликует результаты баскетбольных матчей в Эфириуме",
        link: "https://bits.media/associated-press-opublikuet-rezultaty-basketbolnykh-matchey-v-efiriume/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fcdn.buttercms.com%2FHLrxn5xQKa4ItpvAbC9K",
        title: "MARSEILLENEWS.NET",
        text: "AP s’associe à Everipedia pour diffuser les scores de la folie de mars de la NCAA sur la blockchain d’Ethereum",
        link: "https://www.marseillenews.net/ap-sassocie-a-everipedia-pour-diffuser-les-scores-de-la-folie-de-mars-de-la-ncaa-sur-la-blockchain-dethereum/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fkr.coinness.com%2Fpublic%2Fimg%2Fkr_summary_large_image.png",
        title: "KR.COINNESS.COM",
        text: "AP통신, 이더리움 블록체인에 NCAA 경기 스코어 기록 | 코인니스\n암호화폐 전문 미디어 유투데이에 따르면, AP통신이 블록체인 기술 스타트업 에브리피디아",
        link: "https://kr.coinness.com/news/921818"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fdstreet.io%2Fwp-content%2Fuploads%2F2021%2F02%2Fds_thumb.jpg",
        title: "DSTREET.IO",
        text: "AP통신, 이더리움 블록체인에 NCAA 경기 스코어 기록 - 디스트리트 / D.STREET\n암호화폐 전문 미디어 유투데이에 따르면, AP통신이 블록체인 기술 스타트업 에브리피디아",
        link: "https://dstreet.io/blockchain/flash-news/2021/03/14827/"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=http%3A%2F%2Fwww.hkbnews.com%2Fimage%2Flogo%2Fsnslogo_20201204094633.jpg",
        title: "WWW.HKBNEWS.COM",
        text: "AP통신, 이더리움 블록체인에 NCAA 경기 스코어 기록 - 한국블록체인뉴스\n암호화폐 전문 미디어 유투데이에 따르면, AP통신이 블록체인 기술 스타트업 에브리피디아",
        link: "https://www.hkbnews.com/news/articleView.html?idxno=37269"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fwww.tokenpost.kr%2Fassets%2Fimages%2Ftokenpost%2Fcommon%2FsnsShareV6.png",
        title: "WWW.TOKENPOST.KR",
        text: "AP통신, 이더리움 블록체인에 NCAA 경기 스코어 기록 - 토큰포스트\n암호화폐 전문 미디어 유투데이에 따르면, AP통신이 블록체인 기술 스타트업 에브리피디",
        link: "https://www.tokenpost.kr/article-56095"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fstorage.cobak.co%2Fdirect%2Fcover_v2.png%3Fv%3D2",
        title: "COBAK.CO.KR",
        text: "AP통신, 이더리움 블록체인에 NCAA 경기 스코어 기록 - 코박\n암호화폐 전문 미디어 유투데이에 따르면, AP통신이 블록체인 기술 스타트업 에브리피디",
        link: "https://cobak.co.kr/community/9/post/469703"
    },
    {
        image: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fcafeptthumb-phinf.pstatic.net%2FMjAyMDEwMjJfMTcy%2FMDAxNjAzMzQ0NjY3ODI1.D0mihwvLML2W-eGYq1DAdpTIzbl13qJQvd9SlxstT9Ag.T3aDMz2kpWY3aIs6K6GKwAp98LTSpn51pfMVvcdfrR4g.JPEG%2FKakaoTalk_20201022_143026203.jpg%3Ftype%3Dw740",
        title: "CAFE.NAVER.COM",
        text: "(코린뉴스)AP통신, 이더리움 블록체인에 NCAA 경기 스코어 기록\n대한민국 모임의 시작, 네이버 카페",
        link: "https://cafe.naver.com/1djr58/78495"
    }
];

const reddit = [
    "https://www.reddit.com/r/ethereum/comments/m7xaay/the_associated_press_will_be_publishing_march/",
    "https://www.reddit.com/r/BitcoinExchangeGuide/comments/m8k8vt/ap_partners_with_everipedia_to_broadcast_ncaas/",
];

function PressPane() {
    return <CardColumns>
        {
            press_json.map(p =>
                <Card key={`press_${p.link}`}>
                    <Card.Img variant="top" src={p.image}/>
                    <Card.Body>
                        <Card.Title>
                            <Link href={p.link} target="_blank">
                                View
                            </Link>
                        </Card.Title>
                        <Card.Text>
                            {p.text}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">{p.title}</small>
                    </Card.Footer>
                </Card>)}

    </CardColumns>
}

function GetBlockExplorerLink(network, contractAddress) {
    return <>{network === "mainnet" ?
        <a href={`https://etherscan.io/address/${contractAddress}`}
           target="_blank">{contractAddress}</a>
        : network.startsWith("rinkeby") ?
            <a href={`https://rinkeby.etherscan.io/address/${contractAddress}`}
               target="_blank">{contractAddress}</a>
            : network.startsWith("bsc") ?
                <a href={`https://bscscan.com/address/${contractAddress}`}
                   target="_blank">{contractAddress}</a>
                : network.startsWith("matic") ?
                    <a href={`https://explorer-mainnet.maticvigil.com/address/${contractAddress}`}
                       target="_blank">{contractAddress}</a>
                    : network.startsWith("bsc_testnet") ?
                        <a href={`https://testnet.bscscan.com/address/${contractAddress}`}
                           target="_blank">{contractAddress}</a>
                        : network.startsWith("matic_testnet") ?
                            <a href={`https://explorer-mumbai.maticvigil.com/address/${contractAddress}`}
                               target="_blank">{contractAddress}</a> : null}</>
}

function GetNetworkString(network) {
    return <>ethereum "{network}" {network === "mainnet" ? "" : "testnet"}</>
}

function Info({contractAddress, infuraUrl, ipfsHash, network}) {
    console.log(network)
    return <div>
        <h3>How to access the on-chain data</h3>
        This will get you started with retrieving the latest data from the smart contract on
        the {GetNetworkString(network)}
        <br/>
        You will need an Infura API Key, get one here: <a href="https://infura.io/register"
                                                          target="_blank">https://infura.io/register</a><br/><br/>
        Block Explorer: {GetBlockExplorerLink(network, contractAddress)}<br/>
        IPFS Data: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank">{ipfsHash}</a><br/><br/>
        <SyntaxHighlighter language="javascript" style={docco}>
            {/*<pre>*/}
            {`const ethers = require("ethers");
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

const contractAddress = "${contractAddress}"
const provider = new ethers.providers.JsonRpcProvider("${infuraUrl}");
let contract = new ethers.Contract(contractAddress, abi, provider);
const ipfsHash = await contract.ipfsFullData();
const data = await ethers.utils.fetchJson(\`https://gateway.pinata.cloud/ipfs/\${ipfsHash}\`);
const statistics = await ethers.utils.fetchJson(\`https://gateway.pinata.cloud/ipfs/\${data.statistics_hash}\`);
const allData = {
    tournament: data.tournament,
    statistics: statistics
}
        `}
        </SyntaxHighlighter>
        {/*</pre>*/}
    </div>
}

function TeamStatsViewer({team, index}) {
    return (
        <Card key={`cardTeam_${index}`}>
            <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                {team?.team?.market} {team?.team?.name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body>
                    <CardColumns key={`cardColums_${index}`}>
                        {team.players.map(p => <PlayerCard player={p} key={`player_${p.id}`}/>)}
                    </CardColumns>
                </Card.Body>
            </Accordion.Collapse>
        </Card>)
}

function PlayerCard({player}) {
    const {full_name, average, total} = player;

    const rows = new Set([...Object.keys(average), ...Object.keys(total)]);
    return <Card>
        <Card.Header>{full_name}</Card.Header>
        <Card.Body>
            <Table striped bordered hover size="sm" className={styles.statTable}>
                <thead>
                <tr>
                    <th>stat</th>
                    <th>average</th>
                    <th>total</th>
                </tr>
                </thead>
                <tbody>
                {[...rows].map(h =>
                    <tr key={`stat_${h}`}>
                        <td>{h}</td>
                        <td>{average[h]}</td>
                        <td>{total[h]}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Card.Body>
    </Card>
}

export function JsonViewer({jsonData, isRaw}) {
    if (typeof window !== 'undefined' && !isRaw) {
        const ReactJson = require('react-json-view').default // SSR problem with this library
        return <ReactJson
            collapsed={3}
            enableClipboard={false}
            src={jsonData}/>
    }
    return <pre>{JSON.stringify(jsonData, null, 4)}</pre>
}

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

function convertFromSportRadar(data) {
    const firstFour = GetBracketsInOrder(0, data.rounds.find(r => r.sequence === 1).bracketed);
    const firstRound = GetBracketsInOrder(1, data.rounds.find(r => r.sequence === 2).bracketed);
    const secondRound = GetBracketsInOrder(2, data.rounds.find(r => r.sequence === 3).bracketed);
    const sweet16 = GetBracketsInOrder(3, data.rounds.find(r => r.sequence === 4).bracketed);
    const eliteEight = GetBracketsInOrder(4, data.rounds.find(r => r.sequence === 5).bracketed);
    const finalFour = data.rounds.find(r => r.sequence === 6).games;
    const nationalChampionship = data.rounds.find(r => r.sequence === 7).games;
    return {firstFour, firstRound, secondRound, sweet16, eliteEight, finalFour, nationalChampionship}
}

const convertFromGameObjToSeeds = (games, j) => games.map(g => {
    j += 1;
    return ({
        id: j,
        date: `${new Date(g.scheduled).toDateString()} ${new Date(g.scheduled).toLocaleTimeString('en-US')}`,
        teams: [g.home, g.away],
        winner: g.home_points && g.away_points ? (g.home_points > g.away_points ? g.home.alias : g.away.alias) : '',
        game: g
    })
});

const SeedTeamWrapper = ({winner, team, team_points, tooltip_position}) => {
    const isWinner = winner === team?.alias;
    return <SeedTeam
        style={{color: isWinner ? 'green' : 'white'}}
    >
        <OverlayTrigger
            key={tooltip_position}
            placement={tooltip_position}
            overlay={
                <Tooltip id={`tooltip-${team?.alias}`}>
                    {team.name}
                </Tooltip>
            }
        >
            <div
                style={{fontWeight: isWinner ? "700" : "400"}}>{isWinner ? "🏆" : ""}{team?.alias || 'NO TEAM '} {team?.seed && `(${team?.seed})`}</div>
        </OverlayTrigger>
        <div style={{display: "inline"}}>{team_points}</div>
    </SeedTeam>
};

export const ReactBrackets = ({data}) => {
    const {firstFour, firstRound, secondRound, sweet16, eliteEight, finalFour, nationalChampionship} = convertFromSportRadar(data)
    let i = 1;
    let j = 0;
    const firstFourRound = [
        {
            title: 'First Four',
            seeds: convertFromGameObjToSeeds(firstFour, j)
        }
    ];
    const rounds = [
        {
            title: 'First Round',
            seeds: convertFromGameObjToSeeds(firstRound, i)
        },
        {
            title: 'Second Round',
            seeds: convertFromGameObjToSeeds(secondRound, i) || []
        }, {
            title: 'Sweet 16',
            seeds: convertFromGameObjToSeeds(sweet16, i) || []
        }, {
            title: 'Elite Eight',
            seeds: convertFromGameObjToSeeds(eliteEight, i) || []
        }, {
            title: 'Final Four',
            seeds: convertFromGameObjToSeeds(finalFour, i) || []
        }, {
            title: 'National Championship',
            seeds: convertFromGameObjToSeeds(nationalChampionship, i) || []
        },
    ];


    const CustomSeed = (seed, breakpoint, roundIndex) => {
        // breakpoint passed to Bracket component
        // to check if mobile view is triggered or not

        // mobileBreakpoint is required to be passed down to a seed
        return (
            <Seed mobileBreakpoint={breakpoint} style={{fontSize: 14}}>
                <SeedItem>
                    <div>
                        <SeedTeamWrapper
                            winner={seed.winner}
                            team={seed.teams[0]}
                            team_points={seed.game.home_points}
                            tooltip_position={'top'}/>
                        <SeedTeamWrapper
                            winner={seed.winner}
                            team={seed.teams[1]}
                            team_points={seed.game.away_points}
                            tooltip_position={'bottom'}/>
                    </div>
                </SeedItem>
                <div className="sc-gKsewC ha-DNGW">{seed.date}</div>
            </Seed>
        );
    };

    return <div className={styles.brackets}>
        <Bracket rounds={firstFourRound} renderSeedComponent={CustomSeed}/>
        <Bracket rounds={rounds} renderSeedComponent={CustomSeed}/>
    </div>;
};
