import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMarketplaceProxy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy implementation
  const marketplace = await deploy("Marketplace", {
    from: deployer,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        methodName: "initialize",
        args: [],
      },
    },
    log: true,
  });

  console.log(`Marketplace proxy deployed to: ${marketplace.address}`);
};

export default deployMarketplaceProxy;
deployMarketplaceProxy.tags = ["Marketplace"];
