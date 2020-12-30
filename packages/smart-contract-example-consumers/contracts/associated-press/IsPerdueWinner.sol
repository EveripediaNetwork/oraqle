// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "oraqle-contracts/contracts/associated-press/Jan2021SenateRunoffs.sol";

contract IsPerdueWinner {
    Jan2021SenateRunoffs internal senateRunoffContract;

    constructor() public {
        // kovan https://kovan.etherscan.io/address/0x0792724900B551d200D954a5Ed709d9514d73A9F
        // mainnet https://etherscan.io/address/0x3E961f9A77146F6230709D767d60025f1Ed3Bfef
        senateRunoffContract = Jan2021SenateRunoffs(
            // kovan address
            0x0792724900B551d200D954a5Ed709d9514d73A9F
            /* mainnet address
            0x3E961f9A77146F6230709D767d60025f1Ed3Bfef*/
        );
    }

    function isPerdueWinner() public view returns (bool) {
        return
            keccak256(
                bytes(senateRunoffContract.winners("U.S. Senate Class II"))
            ) == keccak256(bytes("Perdue"));
    }
}
