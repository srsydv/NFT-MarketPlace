const PiNFT = artifacts.require("piNFT");
const SampleERC20 = artifacts.require("sampleERC20");

module.exports = function (deployer) {
  deployer.deploy(PiNFT, "Aconomy", "ACO");
  deployer.deploy(SampleERC20);
};
