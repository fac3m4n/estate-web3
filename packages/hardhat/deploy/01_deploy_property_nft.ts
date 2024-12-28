import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployPropertyNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("PropertyNFT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const propertyNFT = await hre.ethers.getContract<Contract>("PropertyNFT", deployer);
  console.log("👋 Initial balance:", await propertyNFT.balanceOf(deployer));
};

export default deployPropertyNFT;

deployPropertyNFT.tags = ["PropertyNFT"];
