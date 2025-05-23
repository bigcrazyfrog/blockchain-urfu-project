import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployDiplomaRegistry: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("DiplomaRegistry", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployDiplomaRegistry;
