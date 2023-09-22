const { network, ethers } = require("hardhat");
const {developmentChains,networkConfig} = require('../helper-hardhat-config')



// BASE_FEE;
// GAS_PRICE_LINK;
// MAX_CONSUMERS = 100;

const BASE_FEE = ethers.parseEther("0.25"); //0.25 is the premium. It cost 0.25 link per request
const GAS_PRICE_LINK = 1e9

module.exports = async function ({getNamedAccounts, deployments}){
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    if(developmentChains.includes(network.name)){
        log("Local network detected! Deploying mocks...")

        // deploying the mocks vrfcoordinator...
        await deploy("VRFCoordinatorV2Mock",{
            from: deployer,
            args: [BASE_FEE,GAS_PRICE_LINK],
            log: true,
        })
        log("Mocks Deployed"),
        log("___________________")
    }
}

module.exports.tags = ["all","mocks"]