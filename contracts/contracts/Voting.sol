// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.19 < 0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract Voting is Permissioned {
    struct Product {
        string name;
        uint256 price;
    }
    euint32 internal EN_ONE = FHE.asEuint32(1);
    euint32 internal EN_DIV = FHE.asEuint32(2);
    euint32 internal MAX_RATING = FHE.asEuint32(5);
    euint32 internal PERCENTAGE = FHE.asEuint32(100);

    // Product Collection
    mapping(uint256 => Product) public nftCollection;
    mapping(address => bool) public openUser;
    uint256 public nftCount;

    // Store Data
    euint32 _storePoint;
    euint32 _storeCount;

    // User Data
    mapping(address => uint256) internal _points; // user total points
    mapping(address => euint32) internal _userVoteCount; // already vote amount
    mapping(address => euint32) internal _userVoteTotalPoints; // total amount*rating

    // Voting State
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Add a new Product to the collection
    function addProduct(string memory name, uint256 price) public onlyOwner {
        nftCollection[nftCount] = Product(name, price);
        nftCount += 1;
    }

    // Purchase an Product
    function purchaseProduct(uint256 nftId) public payable {
        require(nftId < nftCount, "Invalid Product ID");
        Product memory nft = nftCollection[nftId];
        require(msg.value >= nft.price, "Insufficient funds to purchase Product");
        uint256 newPoints = nft.price; // 1 wei per point
        _points[msg.sender] = _points[msg.sender] + newPoints; // Add points to user's account
    }

    // Cast a vote
    function castVote(inEuint32 calldata _rating, inEuint32 calldata _point) public {
        euint32 rating = FHE.asEuint32(_rating);
        euint32 points = FHE.asEuint32(_point);
        euint32 enTotalPoint = FHE.asEuint32(_points[msg.sender]);
        FHE.req(FHE.gt(MAX_RATING, rating));
        _userVoteCount[msg.sender] = _userVoteCount[msg.sender] + points;
        _userVoteTotalPoints[msg.sender] = _userVoteTotalPoints[msg.sender] + points * rating;
        FHE.req(FHE.gt(enTotalPoint, _calculateVotePoints(_userVoteCount[msg.sender])));
        
        _storeCount = _storeCount + points;
        _storePoint = _storePoint + points*rating;
    }

    // Change a vote
    function changeVote(inEuint32 calldata _rating, inEuint32 calldata _point) public {
        euint32 rating = FHE.asEuint32(_rating);
        euint32 points = FHE.asEuint32(_point);
        FHE.req(FHE.gt(MAX_RATING, rating));
        euint32 enTotalPoint = FHE.asEuint32( _points[msg.sender]);
        FHE.req(FHE.gt(enTotalPoint, _calculateVotePoints(points)));
        _storeCount = _storeCount + points - _userVoteCount[msg.sender];
        _storePoint = _storePoint + points*rating - _userVoteTotalPoints[msg.sender];
        _userVoteCount[msg.sender] = points;
        _userVoteTotalPoints[msg.sender] = points * rating;
    } 

    // Retrieve vote results
    function getVoteResults() public view returns (uint32) {
        return FHE.decrypt(_storePoint * PERCENTAGE / _storeCount);
    }

    // Retrieve vote results
    function setOpenUser(bool _openUser) public {
        openUser[msg.sender] = _openUser;
    }

    function getUserVote() public view returns (uint32){
        require( openUser[msg.sender], "not open");
        return FHE.decrypt(_storePoint * PERCENTAGE / _storeCount);
    }


    // Helper: Calculate diminishing vote weight
    function _calculateVoteWeight(inEuint32 calldata _point, address user) internal view returns (euint32) {
        // Retrieve the number of tickets (votes) the user has already cast
        euint32 previousVotes = _userVoteCount[user];
        euint32 points = FHE.asEuint32(_point);
        // The cost of the next vote increases linearly based on previous votes
        euint32 voteCost = (points + previousVotes) * points / EN_DIV;
        return voteCost;
    }
    // Helper: Calculate already spent points
    function _calculateVotePoints(euint32 userVoteCount) internal view returns (euint32) {
        euint32 userVotePoint = (userVoteCount * userVoteCount + EN_ONE) / EN_DIV;
        return userVotePoint;
    }
}
