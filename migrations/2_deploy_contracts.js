var Bettertoken = artifacts.require("./BetterToken.sol");
var shortICO = artifacts.require("./shortICO.sol");

module.exports = function(deployer) {
  deployer.deploy(Bettertoken);
  deployer.deploy(shortICO);
}
