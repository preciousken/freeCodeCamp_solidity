require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require('./tasks/block-number')
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKET_CAP = process.env.COIN_MARKET_CAP
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    sepolia:{
      url:SEPOLIA_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:11155111,
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      chainId:31337,
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled:true,
    outputFile:"gas-report.txt",
    noColors:true,
    currency:"USD",
    coinmarketcap:COIN_MARKET_CAP
  },
  solidity: "0.8.8",
};
