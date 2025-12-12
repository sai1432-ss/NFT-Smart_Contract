const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftCollection", function () {
  let NftCollection, nft, owner, addr1, addr2;

  beforeEach(async function () {
    // Get the signers (accounts)
    [owner, addr1, addr2] = await ethers.getSigners();
    // Deploy the contract before every test
    NftCollection = await ethers.getContractFactory("NftCollection");
    nft = await NftCollection.deploy("https://api.mynft.com/metadata/"); 
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have 0 supply initially", async function () {
      expect(await nft.totalSupply()).to.equal(0);
    });

    it("Should set the correct Base URI", async function () {
      expect(await nft.baseURI()).to.equal("https://api.mynft.com/metadata/");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint", async function () {
      await expect(nft.safeMint(addr1.address))
        .to.emit(nft, "TokenMinted")
        .withArgs(addr1.address, 1);
      
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(nft.connect(addr1).safeMint(addr1.address))
        .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should verify gas usage is reasonable", async function () {
       const tx = await nft.safeMint(owner.address);
       const receipt = await tx.wait();
       console.log(`\tGas used for mint: ${receipt.gasUsed.toString()}`);
       expect(receipt.gasUsed).to.be.below(200000); 
    });
  });

  describe("Metadata", function () {
    it("Should return correct tokenURI", async function () {
      await nft.safeMint(owner.address);
      // It should combine Base URI + Token ID (1)
      expect(await nft.tokenURI(1)).to.equal("https://api.mynft.com/metadata/1");
    });

    it("Should revert for non-existent token", async function () {
       // We haven't minted token #99, so this should fail
       await expect(nft.tokenURI(99))
        .to.be.revertedWithCustomError(nft, "ERC721NonexistentToken");
    });
  });

  describe("Security (Pausing)", function () {
    it("Should pause and unpause correctly", async function () {
      await nft.pause();
      expect(await nft.paused()).to.equal(true);
      
      await nft.unpause();
      expect(await nft.paused()).to.equal(false);
    });

    it("Should prevent minting when paused", async function () {
      await nft.pause();
      
      // Try to mint while paused -> Should fail
      await expect(nft.safeMint(owner.address))
        .to.be.revertedWithCustomError(nft, "EnforcedPause");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens correctly", async function () {
      await nft.safeMint(owner.address);
      // Transfer from owner to addr1
      await nft.transferFrom(owner.address, addr1.address, 1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });
  });
});