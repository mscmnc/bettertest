/**
 *  Donate contract.
 *  Donated Ether will be stored safely at the wallet and returned to the Donate contract if goal is not reached, participans can withdraw their funds.
 *  Internal audit:
 *  Audit:
 **/

pragma solidity ^0.4.21;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}


contract token {
	function transferFrom(address sender, address receiver, uint amount) returns(bool success) {}
	function burn() {}
}

library SafeMath {
    function mul(uint a, uint b) internal returns (uint) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function sub(uint a, uint b) internal returns (uint) {
        assert(b <= a);
        return a - b;
    }

    function add(uint a, uint b) internal returns (uint) {
        uint c = a + b;
        assert(c >= a && c >= b);
        return c;
    }
    function div(uint a, uint b) internal pure returns (uint) {
      return a / b;
    }
}

contract shortICO is Ownable {
     using SafeMath for uint;
     /* Token owner address */
	address public tokenOwner;
	/* If the funding goal is not reached, donors may withdraw their funds */
	uint constant public donateGoal = 100000000000000000000;
	/* Token price  */
	uint public price = 1000000000000000;
	/* Checks how much already raised (in ETH) */
	uint public amountRaised;
	/* The start date is 2018-05-02, 7 am. */
	uint public start = 1525244400;
	/* The end date of the donate is 2018-10-15, 12 am. */
	uint public end = 1539561600;
	/* Checks how much already raised in Tokens */
	uint public tokensSold = 0;
	/* Checks how much already raised in Tokens */
	uint public donorsCount = 0;
	/* The address of the token contract */
	token public tokenReward;
	/* Balances (in ETH) of all donors */
	mapping(address => uint) public balanceOf;
	/* Indicates if the crowdsale has been closed already */
	bool public donateClosed = false;
	/* The wallet on which the funds will be stored */
	address dnWallet;
	/* notifying transfers and the success of the crowdsale*/
	event GoalReached(address _tokenOwner, uint _amountRaised);
	event FundTransfer(address backer, uint amount, bool isContribution, uint _amountRaised);


    /* Initialization */

	function shortICO () public {

    }

    /* Set tokenAddr */
    function setTokenAddr (address tokenAddr, address walletAddr, address tokenOwnerAddr) onlyOwner public {
        tokenReward = token(tokenAddr);
        dnWallet = walletAddr;
        tokenOwner = tokenOwnerAddr;
    }

	/* Donate by sending ether to the contract. */
	function() payable {
		if (msg.sender != dnWallet) //do not trigger donate if the wallet is returning the funds
			donate(msg.sender);
	}


	/* make an donate
	 *  only callable if the donate started and hasn't been closed already and the maxGoal wasn't reached yet.
	 *  the current token price is looked up and the corresponding number of tokens is transfered to the receiver.
	 *  the sent value is directly forwarded to a safe wallet.
	 *  this method allows to donate in behalf of another address.*/
	function donate(address _receiver) payable {
		uint amount = msg.value;
		uint numTokens = amount.div(price);

        require(numTokens>0);
        require(!donateClosed && now >= start && now <= end && tokensSold.add(numTokens) <= donateGoal);
        dnWallet.transfer(amount);
        balanceOf[_receiver] = balanceOf[_receiver].add(amount);
        amountRaised = amountRaised.add(amount);
        tokensSold += numTokens;
        donorsCount += 1;
        assert(tokenReward.transferFrom(tokenOwner, _receiver, numTokens));
        FundTransfer(_receiver, amount, true, amountRaised);

	}


	modifier afterDeadline() {
		if (now > end)
			_;
	}

	/* checks if the goal or time limit has been reached and ends the donate campaign */
	function checkGoalReached() afterDeadline {
		require(msg.sender == tokenOwner);

		if (tokensSold >= donateGoal) {
			tokenReward.burn(); //burn remaining tokens but the reserved ones
			GoalReached(tokenOwner, amountRaised);
		}
		donateClosed = true;
	}

	/* allows the funders to withdraw their funds if the goal has not been reached.
	 *  only works after funds have been returned from the wallet. */
	function safeWithdrawal() afterDeadline {
		uint amount = balanceOf[msg.sender];
		if (address(this).balance >= amount) {
			balanceOf[msg.sender] = 0;
			if (amount > 0) {
				msg.sender.transfer(amount);
				FundTransfer(msg.sender, amount, false, amountRaised);
			}
		}
	}

}
