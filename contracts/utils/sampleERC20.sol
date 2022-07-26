// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SampleERC20 is ERC20("SampleERC20", "TT") {
    function mint(address _recipient, uint256 _amount) external {
        _mint(_recipient, _amount);
    }
}