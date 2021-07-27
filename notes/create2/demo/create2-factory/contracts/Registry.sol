// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Registry {

  address public child;

  constructor () {}

  function setChildAddress(address _address) public {
    child = _address;
  }

  function getChildAddress() public view returns (address) {
    return child;
  }

}