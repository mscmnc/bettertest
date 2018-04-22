var ChainList = artifacts.require("./ChainList.sol");
var Bettertoken = artifacts.require("./Bettertoken.sol")

module.exports = function(deployer) {
  deployer.deploy(ChainList);
  deployer.deploy(Bettertoken);
}
