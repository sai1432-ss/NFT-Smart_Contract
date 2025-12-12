// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol"; 
import "@openzeppelin/contracts/utils/Strings.sol";

contract NftCollection is ERC721, Ownable, Pausable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 100;
    uint256 public totalSupply;
    string private _baseTokenURI;

    event TokenMinted(address indexed to, uint256 indexed tokenId);

    constructor(string memory baseURI_) ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        _baseTokenURI = baseURI_;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) external onlyOwner whenNotPaused {
        require(totalSupply < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = totalSupply + 1;
        totalSupply++;

        _safeMint(to, tokenId);
        emit TokenMinted(to, tokenId);
    }

    // Internal function required by OpenZeppelin
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Public helper function required by the Test Suite (MISSING IN PREVIOUS STEP)
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string.concat(base, tokenId.toString()) : "";
    }
}