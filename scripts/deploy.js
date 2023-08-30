// importing of the modules
const {ethers,run,network} = require('hardhat')
require("dotenv").config()

// yarn hardhat run scripts/deploy.js

// importing of the modules
// async function
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Please wait... Deploying..."+ " to chainId: "+ network.config.chainId);
  // Deploy the contract
  const simpleStorage = await SimpleStorageFactory.deploy();

  if(network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
    await simpleStorage.deploymentTransaction().wait(6)
    await verify( await simpleStorage.getAddress(),[])
  }

  // Wait for the contract to be deployed
  const address = await simpleStorage.getAddress()

  console.log(`Deployed contract to: ${address}`);
  const currentValue = await simpleStorage.retrieve();
  console.log(currentValue);

 // Updating the current value
 const transactionResponse = await simpleStorage.store(7);

// //  retrieving again
const updated = await simpleStorage.retrieve();
console.log(`updated value is: ${updated}`)
}

// verifying your contract
async function verify(contractAddress,args){
  console.log('verifying your contract')
 try {
  await run("verify:verify",{
    address:contractAddress,
    constructorArguments:args
  })
 } catch (error) {
  console.log(error)
 }
}

// main
main().then(() => {
  console.log("Deployment completed.");
  process.exit(0);
}).catch(err => {
  console.error("Error deploying contract:", err);
  process.exit(1);
});
//