// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle_NotEnoughETHEntered();
error Raffle_TransferFailed();
error Raffle_NotOpen();
error Raffle_NoteOpen(); 
error Raffle_UpKeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

/**
 * @title A sample Raffle Contract
 * @author Precious Ademola www.github.com/preciousken
 * @notice This contract is for creating an untamperable decentralized smart contract
 * @dev This implements chainlink VRF and chainlink keepers
 */

abstract contract Raffle is VRFConsumerBaseV2,KeeperCompatibleInterface{

    // Types declaration
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    // state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gaseLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callBackGasLimit;
    uint32 private constant NUM_WORDS = 1 ;

    // Lottery variables
    address private s_recenteWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    // Events
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2, 
        uint256 entranceFee, 
        bytes32 gasLane, 
        uint64 subscriptionId, 
        uint32 callbackgaslimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gaseLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callBackGasLimit = callbackgaslimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
        
    }

    // Entering a lottery
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle_NotEnoughETHEntered();
        }
        if(s_raffleState != RaffleState.OPEN){
            revert Raffle_NoteOpen();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }
    //
    /**
     * 
     * @dev This is the function that the chainlink keeper nodes call 
     * they look for the `upKeepNeeded` to return true.
     * The following should be true in order to return true:
     * 1. Our time interval should have passed
     * 2. The lottery should have at least 1 player, and have some ETH
     * 3. Our subscription is funded
     * 4. the lottery should be in open state
     */

    function checkUpKeep( bytes memory /*checkData*/) public view returns (bool upKeepNeed, bytes memory) {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = address(this).balance > 0 ;
        bool upKeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    function performUpkeep(bytes memory /*performData*/) external {
        // Request a random number
        // Once we get it, do something with it
        // 2 transaction process
        // 3. Our subscription is funded with LINK
        // 4. The lottery should be in an "open" state.
        (bool upKeepNeeded, ) = checkUpKeep("");

        if(!upKeepNeeded){
            revert Raffle_UpKeepNotNeeded( address(this).balance, s_players.length, uint256(s_raffleState));
        }

        s_raffleState = RaffleState.CALCULATING;

       uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gaseLane, //
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callBackGasLimit,
            NUM_WORDS
            );
        
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recenteWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;

        // Resetting the constants
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;

        // Sending the money to the winner;
        (bool success,) = recentWinner.call{value: address(this).balance}("");
        if(!success){
            revert Raffle_TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /**View / Pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address payable) {
        return s_players[index]; 
    }

    // function getRecentWinner() public view  returns (address) {
    //     return s_recenteWinner;
    // }
    
    function getRaffleState() public view  returns (RaffleState) {
        return s_raffleState;
    }

    function getRecentWinner() public view  returns (address) {
        return s_recenteWinner;
    }

    function getNumberOfPlayers() public view  returns (uint256) {
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns(uint256){
        return s_lastTimeStamp;
    }

    function getRequestConfirmation() public pure  returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
  