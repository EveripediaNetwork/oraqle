// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/*


oooooo   oooooo     oooo            .o8         .oooo.   
 `888.    `888.     .8'            "888       .dP""Y88b  
  `888.   .8888.   .8'    .ooooo.   888oooo.        ]8P' 
   `888  .8'`888. .8'    d88' `88b  d88' `88b     <88b.  
    `888.8'  `888.8'     888ooo888  888   888      `88b. 
     `888'    `888'      888    .o  888   888 o.   .88P  
      `8'      `8'       `Y8bod8P'  `Y8bod8P' `8bd88P'   


*/


/**
 * @dev Implementation of the January 5th, 2021 Senate Run-off Oracle with Associated Press
 *
 * All interested consumers can freely access the race calls from the "winners" mapping
 * You may also listen for the "SetWinner" event.
 */
contract Jan2021SenateRunoffs is Ownable {
    /**
     *  @dev Event is called whenever a winner is called
     */
    event SetWinner(string positionName, string winnerLastName);

    /**
     *  @dev Where the senate run-off winners are stored. Mapping position to the winner's last name.
     * "U.S. Senate Class II": "Perdue"
     * "U.S. Senate Class III": "Loeffler"
     */
    mapping(string => string) public winners;

    /**
     *  @dev Only callable by AP. Used to make a race call
     */
    function setWinner(string memory positionName, string memory winnerLastName)
        public
        onlyOwner
    {
        winners[positionName] = winnerLastName;
        emit SetWinner(positionName, winnerLastName);
    }
}
