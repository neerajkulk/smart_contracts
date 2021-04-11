// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Lottery {
    address payable public manager;
    address payable[] public players;

    constructor() {
        manager = payable(msg.sender);
    }
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(payable(msg.sender));
    }

    function pickWinner() public restricted {
        uint idx = random(players.length - 1);
        players[idx].transfer(address(this).balance);
        delete players; // reset players
    }
    
    function random(uint _max) private view returns(uint){
        uint number = uint(keccak256(abi.encodePacked(block.timestamp, players)));
        return number % (_max + 1);
    }
    
    function getPlayers() public view returns(address payable[] memory){
        return players;
    }
     
    function getBalance() public view returns(uint){
        return address(this).balance;
    }    
}