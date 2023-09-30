const { getNamedAccounts, ethers } = require("hardhat")
const {getWeth} = require("./getWeth")
async function main(){
await getWeth()
const {deployer} = await getNamedAccounts()
// abi, address

// Lending Pool Address Provider: 0xb53c1a33016b2dc2ff3653530bff1848a515c8c5
// Lending Pool: ^
const signer = await ethers.provider.getSigner()
const lendingPool = await getLendingPool(signer)
console.log(`LendingPool address ${lendingPool}`)  // 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9

// deposit!
const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
// approve


}


async function getLendingPool(account){
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
        account
    )

    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    )
}

async function approveErc20(contractAddress, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("")
}

main().then(()=> console.log(process.exit(0))).catch((err)=>{
    console.log(err)
    process.exit(1)
})