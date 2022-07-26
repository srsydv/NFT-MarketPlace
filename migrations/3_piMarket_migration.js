const PiMarket = artifacts.require("piMarket");

module.exports = function (deployer) {
  deployer.deploy(PiMarket, "0x68d5ec09be68e275b59bcfc2b5a2eff1adc4aae2");
};
