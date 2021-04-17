// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint _minimumContribution) public {
        Campaign newCampaign = new Campaign(_minimumContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }
    
    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value; 
        address recipient;
        bool complete;
        uint approvalCount;
    }
    

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint public numFunders;
    mapping(address => bool) public funders;
    mapping(bytes32 => bool) voteHash;
    
    modifier restriced(){
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint _minimumContribution, address _manager) {
        manager = _manager;
        minimumContribution = _minimumContribution;
        numFunders = 0;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution);
        require(!funders[msg.sender]);
        funders[msg.sender] = true;
        numFunders++;
    }
    
    function createRequest(string memory _description, uint _value, address _recipient) public restriced {
        Request memory newRequest = Request({
            description:_description,
            value:_value,
            recipient: _recipient,
            complete:false,
            approvalCount:0
        });
        requests.push(newRequest);
    }
    
    function approveRequest(uint _requestId) public {
        require(funders[msg.sender]);
        bytes32 _voteHash = keccak256(abi.encodePacked(_requestId, msg.sender));
        require(voteHash[_voteHash] == false); // no previous vote
        voteHash[_voteHash] = true;
        requests[_requestId].approvalCount++;
    }
    
    function finalizeRequest(uint _requestId) public restriced {
        Request storage request = requests[_requestId];
        require(!request.complete);
        require(request.approvalCount > numFunders/2);
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
        
}