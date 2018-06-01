var Bettertoken = artifacts.require("./BetterToken.sol")

module.exports = function(deployer) {
  deployer.deploy(Bettertoken);
}
