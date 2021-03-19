pragma solidity ^0.5.4;

// Guess the password for the safe
// Deployed on Ropsten: 0xC224beb93142607b91d21BBd4A67a34a50E26AAB
contract challenge2 {
    bytes32 private hash;
    address public owner;

    constructor(string memory secretPassword) public payable {
        require(msg.value == 1 ether); //1 Ether Deposit required
        owner = msg.sender;
        hash = keccak256(abi.encode(secretPassword));
    }

    function changePassword(string memory secretPassword) public payable {
        require(msg.sender == owner); //OnlyOwner
        require(msg.value == 1 ether); //1 Ether Deposit required
        hash = keccak256(abi.encode(secretPassword));
    }

    function guessPassword(string memory password) public payable {
        require(keccak256(abi.encode(password)) == hash);
        msg.sender.transfer(1337);
    }
}
