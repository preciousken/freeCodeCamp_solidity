// importing of the modules
const {ethers} = require('hardhat')

// yarn hardhat run scripts/deploy.js

// importing of the modules
// async function
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Please wait... Deploying...");

  // Deploy the contract
  const simpleStorage = await SimpleStorageFactory.deploy();//

  // Wait for the contract to be deployed
  // await simpleStorage.deployed();

  console.log(`Deployed contract to: ${simpleStorage.address}`);
}

// main
main().then(() => {
  console.log("Deployment completed.");
  process.exit(0);
}).catch(err => {
  console.error("Error deploying contract:", err);
  process.exit(1);
});
