// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Wallet {

    function die() public {
        selfdestruct(payable(address(0)));
    }

    function version() public pure returns (string memory ver) {
       return "1.0";
    }
}
