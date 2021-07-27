// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Example {

  event OwnerChanged(address owner);

  address payable owner;

  constructor() {
    owner = payable(msg.sender);
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function transferOwnership(address payable _owner) public {
    owner = _owner;

    emit OwnerChanged(owner);
  }

  function destroy() public {
    selfdestruct(owner);
  }
}
