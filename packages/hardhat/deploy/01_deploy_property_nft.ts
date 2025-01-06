import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPropertyNFTProxy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy implementation
  const propertyNFT = await deploy("PropertyNFT", {
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

  console.log(`PropertyNFT proxy deployed to: ${propertyNFT.address}`);
};

export default deployPropertyNFTProxy;
deployPropertyNFTProxy.tags = ["PropertyNFT"];
