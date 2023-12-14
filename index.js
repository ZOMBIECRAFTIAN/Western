// Importa las bibliotecas necesarias
const express = require('express');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const TransferContract = require('./build/contracts/TransferContract.json');

// Crea una aplicación Express
const app = express();
const port = 3000;

// Configura Web3 con Ganache usando un mnemónico y una URL de proveedor
const mnemonic = 'hammer width put dentist cry hill fatigue inherit suit pottery nerve metal'; // Reemplaza con tu mnemónico
const provider = new HDWalletProvider({ mnemonic, providerOrUrl: 'http://127.0.0.1:7545' }); // URL de Ganache
const web3 = new Web3(provider);

// Define la dirección del contrato e instancia el contrato
const contractAddress = '0x6b1BEBFeC07314E162dF0AcC41b7F06b589Dc316'; // Reemplaza con la dirección de tu contrato
const transferContract = new web3.eth.Contract(TransferContract.abi, contractAddress);

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Habilita el manejo de solicitudes JSON
app.use(express.json());

// Maneja las solicitudes POST para iniciar transferencias
app.post('/transfer', async (req, res) => {
    const { to, amount } = req.body;
    const accounts = await web3.eth.getAccounts();

    // Convierte la cantidad de Ether a Wei
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

    // Depuración: Imprime información relevante para solucionar problemas
    console.log('Amount: ', amount);
    console.log('Amountinwei: ', amountInWei);
    console.log('Balance before transaction:', await web3.eth.getBalance(accounts[0]));

    try {
        // Depuración: Verifica el saldo de la cuenta
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log('Balance:', balance);

        // Estima el gas para la transacción
        const gasEstimate = await transferContract.methods
        .transferTo(to, amountInWei)
        .estimateGas({ from: accounts[0], value: amountInWei });
                console.log("llego aqui");
        // Calcula el valor total necesario (cantidad + gas estimado)
        const totalValue = web3.utils.toBN(amountInWei).add(web3.utils.toBN(gasEstimate));
        console.log("llego aqui 2");

        // Configuración de gas limit y gas price
        const gasLimit = 6721975;
        const gasprice = 20000000000;

        // Depuración: Imprime información relevante para solucionar problemas
        console.log('Gas Estimate:', gasEstimate);
        console.log('Total Value:', totalValue.toString());

        // Envía la transacción al contrato con información de gas y gasPrice
        const result = await transferContract.methods.transferTo(to, amountInWei).send({
            from: accounts[0],
            value: totalValue.toString(),  // Utiliza el valor total calculado
            gas: gasLimit,
            gasPrice: gasprice,
        });

        // Registra el hash de la transacción
        console.log('Transaction Hash:', result.transactionHash);

        // Escucha el evento TransferCompleted
        transferContract.events.TransferCompleted({}, (error, event) => {
            if (error) {
                console.error('Error en el evento:', error);
            } else {
                console.log('Evento de Transferencia Completada:', event.returnValues);
            }
        });

        // Envía una respuesta exitosa al cliente
        res.send('Transferencia exitosa');
    } catch (error) {
        // Registra y envía una respuesta de error en caso de fallo
        console.error('Error:', error.message);
        res.status(500).send('Transferencia fallida');
    }
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`El servidor está en ejecución en http://localhost:${port}`);
});

