const hre = require("hardhat");

async function main() {
  console.log("Deploying ContentRegistry...");

  const ContentRegistry = await hre.ethers.getContractFactory("ContentRegistry");
  const contentRegistry = await ContentRegistry.deploy();

  await contentRegistry.waitForDeployment();

  const address = await contentRegistry.getAddress();
  console.log("ContentRegistry deployed to:", address);
  console.log("\nCopy this address to backend application.properties:");
  console.log(`blockchain.contract.address=${address}`);
  console.log("\nNetwork: localhost:8545");
  console.log("Chain ID: 1337");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

