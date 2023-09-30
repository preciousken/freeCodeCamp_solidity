require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')
require('solidity-coverage')
require('hardhat-gas-reporter')
require('hardhat-contract-sizer')
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKET_CAP = process.env.COIN_MARKET_CAP;

module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    hardhat:{
      chainId:31337,
      forking:{
        url:MAINNET_RPC_URL
      },
      blockConfirmation:1,
    },
    sepolia:{
      chainId:11155111,
      blockConfirmation:6,
      url:SEPOLIA_RPC_URL,
      accounts:[PRIVATE_KEY]
    }
  },
  gasReporter:{
    enabled:false,
    currency:"USD",
    outputFile:"gas-report.txt",
    noColors:true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY, 
  },
  solidity: {
  compilers:[{version:"0.8.7"},{version:"0.6.6"}, {version:"0.4.19"},{version:"0.6.12"}]
  },
  namedAccounts: {
    deployer:{
      default:0,
    },
    player:{
      default:1,
    },
  }
};