document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            console.error('No Ethereum browser extension detected. Install MetaMask.');
            return;
        }

        // Code to set up your contract interaction...
        const contractAddress = '0x286DF171C9F57Ae31aBceA53c0431CE2ac1d1644'; // Replace with your actual contract address
        const contractABI = [{
            "inputs": [
              {
                "internalType": "address payable",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "transferTo",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
            "payable": true
          }]; // Replace with your actual contract ABI

          const contract = new window.web3.eth.Contract(contractABI, contractAddress);

          window.transfer = async () => {
              const recipient = document.getElementById('recipient').value;
              const amount = document.getElementById('amount').value;
  
              try {
                  const accounts = await window.web3.eth.getAccounts();
                  const result = await contract.methods.transferTo(recipient, amount).send({
                      from: accounts[0],
                      value: window.web3.utils.toWei(amount, 'ether'),
                  });
  
                  document.getElementById('result').innerHTML = `Transaction Hash: ${result.transactionHash}`;
              } catch (error) {
                  document.getElementById('result').innerHTML = `Error: ${error.message}`;
              }
          };
      } catch (error) {
          console.error('Error initializing Ethereum provider:', error);
      }
  });