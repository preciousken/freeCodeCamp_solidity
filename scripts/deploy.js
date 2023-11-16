const {ethers, run,network} = require('hardhat')
require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying SimpleStorage......")
  const  simpleStorage = await SimpleStorageFactory.deploy()
   await simpleStorage.waitForDeployment()
  const contractAddress = await simpleStorage.getAddress()
  console.log(`Contract deployed to: ${contractAddress}`)
  if(network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
    console.log('waiting for block confirmation...')
    await simpleStorage.getDeployedCode()
    await verify(contractAddress,[])
  }

  const initialNum = await simpleStorage.retrieve()
  console.log("initialNum: ",initialNum.toString())
  await simpleStorage.store('17')
  const updated = await simpleStorage.retrieve()
  console.log("updated from " + initialNum + " to " + updated)
 
}

const verify = async (contractAddress,args) => {
 console.log("verifying....")
 try {
  await run("verify:verify",{
    address:contractAddress,
    constructorArguments: args,
   })
 } catch (error) {
  console.log(error)
 }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
