import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMarketplaceFractional: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MarketplaceFractional", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("👋 MarketplaceFractional deployed successfully");
};

export default deployMarketplaceFractional;

deployMarketplaceFractional.tags = ["MarketplaceFractional"];
