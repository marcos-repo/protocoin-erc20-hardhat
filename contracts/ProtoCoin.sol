// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// import "hardhat/console.sol";

contract ProtoCoin {
    
    string public name = "ProtoCoin";
    string public symbol = "PTC";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1_000_000 * 10 ** decimals;

    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Aproval(address indexed _owner, address indexed _spender, uint _value);

    mapping(address => uint256) private _balances;

    constructor() {
        _balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _owner)  public view returns (uint256 balance){
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf(msg.sender) >= _value, "Saldo insuficiente.");

        _balances[msg.sender] -= _value;
        _balances[_to] += _value;


        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
