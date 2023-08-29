require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require('./tasks/block-number')

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    sepolia:{
      url:SEPOLIA_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:11155111,
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  solidity: "0.8.8",
};
