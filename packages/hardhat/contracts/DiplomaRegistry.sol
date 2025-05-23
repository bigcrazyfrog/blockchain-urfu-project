// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DiplomaRegistry {
    struct DiplomaInfo {
        address issuer;
        uint256 timestamp;
        string student;
    }

    mapping(bytes32 => DiplomaInfo) private diplomas;

    event DiplomaRegistered(bytes32 indexed diplomaHash, address indexed issuer);

    function registerDiploma(bytes32 diplomaHash, string memory studentName) external {
        require(diplomas[diplomaHash].issuer == address(0), "Diploma already registered");
        diplomas[diplomaHash] = DiplomaInfo({
            issuer: msg.sender,
            timestamp: block.timestamp,
            student: studentName
        });
        emit DiplomaRegistered(diplomaHash, msg.sender);
    }

    function verifyDiploma(bytes32 diplomaHash) external view returns (bool) {
        return diplomas[diplomaHash].issuer != address(0);
    }

    function getDiplomaInfo(bytes32 diplomaHash) external view returns (address issuer, uint256 timestamp, string memory student) {
        DiplomaInfo memory info = diplomas[diplomaHash];
        require(info.issuer != address(0), "Diploma not found");
        return (info.issuer, info.timestamp, info.student);
    }
}
