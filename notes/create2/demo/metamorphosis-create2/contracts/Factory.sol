// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Factory {
    mapping(address => address) _implementations;

    event Deployed(address indexed addr);

    function deploy(uint256 salt, bytes calldata bytecode) public {
        bytes memory implInitCode = bytecode;

        // assing the init code for the metamorphic contract.
        bytes memory metamorphicCode = (
            hex'5860208158601c335a63aaf10f428752fa158151803b80938091923cf3'
        );

        address metamorphicContractAddress = _getMetamorphicContractAddress(
            metamorphicCode,
            salt
        );

        // declare the variable of the address of implemnentation contract.
        address implementationContract;

        // 1. load the implemetation init code and lenght,
        // 2. Deploy via CREATE
        assembly {
            let encoded_data := add(0x20, implInitCode) // load initlization code
            let encoded_size := mload(implInitCode) // load the length of initialization code
            implementationContract := create(
                // call create will 3 args
                0, // do not forwarding any endowments
                encoded_data, // pass the initialization code
                encoded_size // pass the length of initialization code
            )
        }
        // deploy the code on a seperate address
        // store the implementation address in the mapping by metamorphic contract
        _implementations[metamorphicContractAddress] = implementationContract;

        address addr;
        assembly {
            let encoded_data := add(0x20, metamorphicCode) // load metamorphic code
            let encoded_size := mload(metamorphicCode) // load the length of metamorphic code
            addr := create2(
                // call create will 3 args
                0, // do not forwarding any endowments
                encoded_data, // pass the initialization code
                encoded_size, // pass the length of initialization code
                salt
            )
        }
        require(addr == metamorphicContractAddress, "Failed to deploy");
        emit Deployed(addr);
    }

    function _getMetamorphicContractAddress(
        bytes memory bytecode,
        uint256 _salt
    ) internal view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(bytecode)
            )
        );

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }

    function getImplementation() public view returns (address) {
        return _implementations[msg.sender];
    }
}
