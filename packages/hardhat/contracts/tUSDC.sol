// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract tUSDC is ERC20, Ownable, Pausable {
    uint8 private _decimals = 6; // USDC uses 6 decimals

    // Faucet configuration
    uint256 public constant FAUCET_AMOUNT = 10000000 * 10 ** 6; // 1000000 USDC
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    mapping(address => uint256) public lastFaucetRequest;

    constructor() ERC20("Test USDC", "tUSDC") Ownable(msg.sender) {
        _mint(msg.sender, 10000000 * 10 ** _decimals);
    }

    // Override decimals function to match USDC's 6 decimals
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // Modified mint function to include whenNotPaused modifier
    function mint(address to, uint256 amount) public onlyOwner whenNotPaused {
        _mint(to, amount);
    }

    // Modified burn function to include whenNotPaused modifier
    function burn(uint256 amount) public whenNotPaused {
        _burn(msg.sender, amount);
    }

    // Pause functions
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Faucet function
    function requestTokens() public whenNotPaused {
        require(block.timestamp >= lastFaucetRequest[msg.sender] + FAUCET_COOLDOWN, "Please wait for cooldown period");
        require(balanceOf(address(this)) >= FAUCET_AMOUNT, "Faucet has insufficient balance");

        lastFaucetRequest[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    // Function to fund the faucet
    function fundFaucet(uint256 amount) public {
        _transfer(msg.sender, address(this), amount);
    }
}
