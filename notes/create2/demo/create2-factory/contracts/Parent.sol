// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Child.sol";
import "./Registry.sol";

contract Parent {

  event Pause();
  event Unpause();

  address public owner;
  Child public child;
  Registry public registry;

  constructor(address payable _owner, address _registry) {
    owner = _owner;
    registry = Registry(_registry);
  }

  function setOwner(address _owner) public {
    require(msg.sender == owner);
    owner = _owner;
  }

  function destroy(address payable recipient) public {
    require(msg.sender == owner);
    selfdestruct(recipient);
  }

  // pauses child contract
  function pause() public returns (bool)
  {
    address addr = registry.getChildAddress();
    child = Child(addr);
    child.pause();
    emit Pause();
    return true;
  }

  // unpauses child contract
  function unpause() public returns (bool)
  {
    address addr = registry.getChildAddress();
    child = Child(addr);
    child.unpause();
    emit Unpause();
    return true;
  }

  receive() payable external{
    
  }
}