const TransferContract = artifacts.require("TransferContract");

module.exports = async function (deployer) {
  try {
    await deployer.deploy(TransferContract);
    const transferContract = await TransferContract.deployed();
    console.log("TransferContract deployed at:", transferContract.address);
  } catch (error) {
    console.error("Error deploying TransferContract:", error);
  }
};
