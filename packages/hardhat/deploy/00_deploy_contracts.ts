import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const tbusdDeployment = await deploy("tBUSD", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const propertyNFTDeployment = await deploy("PropertyNFT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const marketplaceDeployment = await deploy("Marketplace", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const marketplaceFractionalDeployment = await deploy("MarketplaceFractional", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const tbusd = await hre.ethers.getContract<Contract>("tBUSD", deployer);
  console.log("👋 Initial balance:", await tbusd.balanceOf(deployer));
  const propertyNFT = await hre.ethers.getContract<Contract>("PropertyNFT", deployer);
  await propertyNFT.initialize();
  await propertyNFT.set(tbusd.address);
};

export default deployContracts;

deployContracts.tags = ["tBUSD"];
