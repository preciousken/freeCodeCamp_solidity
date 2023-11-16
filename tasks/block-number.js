const {task} = require('hardhat/config')

task("block-number", "prints the current block number").setAction(
    async (taskArgs, href) => {
        const blockNumber = await href.ethers.provider.getBlockNumber()
        console.log(`current block number is: ${blockNumber}`)
    }
)

// task("contract-balance", "prints the current contract balance").setAction(
//     async (taskArgs, href) => {
//         const contractBalance = await href.ethers.provider.getBalance()
//         console.log(`current block number is: ${contractBalance}`)
//     }
// )