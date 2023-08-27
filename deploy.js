const ethers = require('ethers');
const fs = require("fs-extra");
require('dotenv').config()

// yarn add ethers@5.4.0

async function main(){
    const provider = new ethers.providers.JsonRpcBatchProvider(process.env.RPC_URL)
    /// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
    const encryptedKeyJson = fs.readFileSync('./.encryptedKey.json','utf-8');
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedKeyJson,process.env.PASSWORD)
    wallet = await wallet.connect(provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi","utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin","utf8");

    const contractFactory = new ethers.ContractFactory(abi,binary,wallet)
    console.log('deploying please wait')
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);

    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current number is: ${currentFavoriteNumber.toString()}`)

    const transactionResponse = await contract.store('7');
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavoriteNumber = await contract.retrieve();

    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)

}

main().then(()=>process.exit(0)).catch((err)=>console.log(err))