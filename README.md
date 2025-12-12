# NFT Collection (ERC-721) Project

## Overview
This project implements a secure, ERC-721 compatible NFT smart contract (`NftCollection.sol`) with a comprehensive automated test suite. It is containerized using Docker to ensure a reproducible testing environment.

The contract allows for minting unique tokens with a maximum supply limit, supports standard ownership transfers, and includes administrative controls for pausing/unpausing operations.

## Features
* **ERC-721 Standard**: Full implementation of ownership, transfers, and approvals.
* **Max Supply**: Strict enforcement of a 100-token limit to prevent inflation.
* **Access Control**: Only the contract owner (admin) can mint new tokens or pause the contract.
* **Security**: Includes a `Pausable` mechanism to stop minting in emergencies.
* **Metadata**: Implements `tokenURI` using a Base URI strategy for gas efficiency.

## Tech Stack
* **Language**: Solidity ^0.8.20
* **Framework**: Hardhat
* **Testing**: Chai & Ethers.js
* **Containerization**: Docker (Node 18 Alpine)

## Project Structure
```text
nft-project/
├── contracts/
│   └── NftCollection.sol   # Main smart contract
├── test/
│   └── NftCollection.test.js # Automated test suite
├── Dockerfile              # Container definition
├── hardhat.config.js       # Hardhat configuration
└── package.json            # Dependencies
