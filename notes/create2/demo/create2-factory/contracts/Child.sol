// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./role/Pausable.sol";
import "./Registry.sol";

contract Child is Pausable {
  address public member;
  Registry public registry;

  // sets parent as pauser
  // adds this Child address to registry
  constructor(address payable _member, address _parent, address _registry) {
    member = address(_member);
    PauserRole.addPauser(address(_parent));
    registry = Registry(_registry);
    registry.setChildAddress(address(this));
  }

  function setMember(address _member) public {
    require(msg.sender == member);
    member = _member;
  }

  function destroy(address payable recipient) public {
    require(msg.sender == member);
    selfdestruct(recipient);
  }

}