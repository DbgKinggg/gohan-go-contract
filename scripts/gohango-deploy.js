const hre = require("hardhat");
const fs = require("fs");
const { artifacts } = require("hardhat");

const action = true;

async function main() {
  await hre.run("compile");

  // We get the contract to deploy
  const contractName = "GohanGo";
  const GohanGo = await hre.ethers.getContractFactory(contractName);

  // only estimate gas
  if (!action) {
    const estimatedGas = await hre.ethers.provider.estimateGas(
      GohanGo.getDeployTransaction().data
    );
    const gasPrice = await hre.ethers.provider.getGasPrice();
    const ethers = hre.ethers.utils.formatEther(estimatedGas.mul(gasPrice));

    console.log(
      `Estimated gas used: ${estimatedGas}, estimated ether used: ${ethers}`
    );

    process.exit(0);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const gohanGo = await GohanGo.deploy();
  await gohanGo.deployed();

  console.log(contractName, " contract deployed to:", gohanGo.address);

  // write artifacts
  const contractArtifacts = await artifacts.readArtifactSync(contractName);
  fs.writeFileSync(
    "./artifacts/contractArtifacts.json",
    JSON.stringify(contractArtifacts, null, 2)
  );

  // verify contract on etherscan
  await verifyContract(gohanGo.address);

  return gohanGo;
}

const verifyContract = async (address) => {
  // verify contract on etherscan
  await hre.run("verify:verify", {
    address,
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
