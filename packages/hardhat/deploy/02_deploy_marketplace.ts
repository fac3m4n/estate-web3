import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Marketplace", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("👋 Marketplace deployed successfully");
};

export default deployMarketplace;

deployMarketplace.tags = ["Marketplace"];
