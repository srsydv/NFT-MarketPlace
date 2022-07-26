const PiNFT = artifacts.require("piNFT");
const SampleERC20 = artifacts.require("sampleERC20");

contract("PiNFT", (accounts) => {
  let piNFT, sampleERC20;
  let alice = accounts[0];
  let validator = accounts[1];
  let bob = accounts[2];
  let royaltyReciever = accounts[3];

  it("should deploy the contracts", async () => {
    piNFT = await PiNFT.deployed();
    sampleERC20 = await SampleERC20.deployed();
    assert(piNFT !== undefined, "PiNFT contract was not deployed");
    assert(sampleERC20 !== undefined, "SampleERC20 contract was not deployed");
  });

  it("should read the name and symbol of piNFT contract", async () => {
    assert.equal(await piNFT.name(), "Aconomy");
    assert.equal(await piNFT.symbol(), "ACO");
  });

  it("should mint an ERC721 token to alice", async () => {
    const tx = await piNFT.mintNFT(alice, "URI1", [[royaltyReciever, 500]]);
    const tokenId = tx.logs[0].args.tokenId.toNumber();
    assert(tokenId === 0, "Failed to mint or wrong token Id");
    assert.equal(await piNFT.balanceOf(alice), 1, "Failed to mint");
  });

  it("should fetch the tokenURI and royalties", async () => {
    const uri = await piNFT.tokenURI(0);
    assert.equal(uri, "URI1", "Invalid URI for the token");
    const royalties = await piNFT.getRoyalties(0);
    assert.equal(royalties[0][0], royaltyReciever);
    assert.equal(royalties[0][1], 500);
  });

  it("should mint ERC20 tokens to validator", async () => {
    const tx = await sampleERC20.mint(validator, 1000);
    const balance = await sampleERC20.balanceOf(validator);
    assert(balance == 1000, "Failed to mint ERC20 tokens");
  });

  it("should let validator add ERC20 tokens to alice's NFT", async () => {
    await sampleERC20.approve(piNFT.address, 500, { from: validator });
    const tx = await piNFT.addERC20(validator, 0, sampleERC20.address, 500, {
      from: validator,
    });
    const tokenBal = await piNFT.viewBalance(0, sampleERC20.address);
    const validatorBal = await sampleERC20.balanceOf(validator);
    assert(tokenBal == 500, "Failed to add ERC20 tokens into NFT");
    assert(validatorBal == 500, "Validators balance not reduced");
  });

  it("should transfer NFT to bob", async () => {
    await piNFT.safeTransferFrom(alice, bob, 0);
    assert.equal(await piNFT.ownerOf(0), bob, "Failed to transfer NFT");
  });

  it("should let bob disintegrate NFT and ERC20 tokens", async () => {
    await piNFT.transferERC20(0, validator, sampleERC20.address, 500, {
      from: bob,
    });
    const validatorBal = await sampleERC20.balanceOf(validator);
    assert.equal(
      await piNFT.viewBalance(0, sampleERC20.address),
      0,
      "Failed to remove ERC20 tokens from NFT"
    );
    assert.equal(
      await sampleERC20.balanceOf(validator),
      1000,
      "Failed to transfer ERC20 tokens to validator"
    );
  });
});
