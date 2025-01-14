import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPropertyNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy implementation
  const propertyNFT = await deploy("PropertyNFT", {
    from: deployer,
    log: true,
  });

  console.log(`PropertyNFT deployed to: ${propertyNFT.address}`);
};

export default deployPropertyNFT;
deployPropertyNFT.tags = ["PropertyNFT"];
