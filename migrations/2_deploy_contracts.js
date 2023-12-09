const TransferContract = artifacts.require("TransferContract");

module.exports = function (deployer) {
  deployer.deploy(TransferContract);
};
