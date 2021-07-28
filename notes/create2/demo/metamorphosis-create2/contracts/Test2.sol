// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Test2 {
    uint public myUint;

    function setUint(uint _myUint) public {
        myUint = 2 * _myUint;
    }

    function killme() public {
        selfdestruct(payable(msg.sender));
    }
}