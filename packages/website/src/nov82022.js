// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import nov2022Abi from "../abis/nov2022elections.abi";

const ethers = require("ethers");

export const addresses = {
  goerli: "0xb6e5881D63Be76c6181796D45890150f00664288",
  matic: "0x7832dBa70DCf40Bc68aDbe10ED4c1C743e910eda",
};

const alchemyApiKeys = {
  goerli: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_BSC,
  matic: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MATIC,
};


const states = ["Alaska", 
                "Alabama", 
                "Arkansas", 
                "American Samoa", 
                "Arizona", 
                "California", 
                "Colorado", 
                "Connecticut", 
                "District of Columbia", 
                "Delaware", 
                "Florida", 
                "Georgia", 
                "Guam", 
                "Hawaii", 
                "Iowa", 
                "Idaho", 
                "Illinois", 
                "Indiana", 
                "Kansas", 
                "Kentucky", 
                "Louisiana", 
                "Massachusetts", 
                "Maryland", 
                "Maine", 
                "Michigan", 
                "Minnesota", 
                "Missouri", 
                "Mississippi", 
                "Montana", 
                "North Carolina", 
                "North Dakota", 
                "Nebraska", 
                "New Hampshire", 
                "New Jersey", 
                "New Mexico", 
                "Nevada", 
                "New York", 
                "Ohio", 
                "Oklahoma", 
                "Oregon", 
                "Pennsylvania", 
                "Puerto Rico", 
                "Rhode Island", 
                "South Carolina", 
                "South Dakota", 
                "Tennessee", 
                "Texas", 
                "Utah", 
                "Virginia", 
                "Virgin Islands", 
                "Vermont", 
                "Washington", 
                "Wisconsin", 
                "West Virginia", 
                "Wyoming"]

const getProviderAndContract = (network) => {
  const provider = new ethers.providers.AlchemyProvider(network, alchemyApiKeys[network]);
  const contractAddress = addresses[network];
  return new ethers.Contract(contractAddress, nov2022Abi, provider);

}

export const getWinnerSenators = async(network, state) => {
  const contract = getProviderAndContract(network);
  const winnerSenators = await contract.getWinnerSenatorsByState(state)
  if(winnerSenators)
    return {state, senators: winnerSenators[1]}
  return undefined
}

export const getWinnerGovernor = async (
  network,
  state
) => {
  const contract = getProviderAndContract(network);
  const governor = await contract.getWinnerGovernors(state);
  return {state, governor: governor[0] ? governor[0] : null}
};

export const getAllSenators = async(network) => {
  return Promise.all(states.map(s => getWinnerSenators(network, s)))
}

export const getAllGovernors = async(network) => {
  return Promise.all(states.map(s => getWinnerGovernor(network, s)))
}


