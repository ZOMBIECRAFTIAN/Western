// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransferContract {
    address public owner;

    event TransferCompleted(address indexed to, uint256 amount);
    event LogMsgValue(uint256 msgValue);
    event LogAmount(uint256 amount); // Nuevo evento para registrar la cantidad

    constructor() {
        owner = msg.sender;
    }

    function transferTo(address payable to, uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");

        // Log msg.value for debugging
        emit LogMsgValue(msg.value);

        // Log amount for debugging
        emit LogAmount(amount); // Emite el evento con la cantidad

        require(msg.value >= amount, "Insufficient Funds");

        to.transfer(amount);

        emit TransferCompleted(to, amount);
    }
}