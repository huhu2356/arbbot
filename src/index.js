const Web3 = require('web3');

const config = require('../config/index');
const Inch = require('./inch');

async function main() {
    const { infura, inch: inchConfig, pair, initAmount } = config;
    const web3 = new Web3(infura);
    const inch = new Inch({ web3, address: inchConfig.address });

    await searchArbOpp({ pair, inch, initAmount });
}

// Triangular Arbitrage: one -> two -> three -> one
async function searchArbOpp({ pair, inch, initAmount }) {
    const [symbolOne, symbolTwo, symbolThree] = pair;

    const resSymbolTwo = await inch.getExpectedReturn({
        fromToken: symbolOne.address,
        destToken: symbolTwo.address,
        amount: initAmount,
    });

    console.log({
        fromToken: symbolOne.address,
        destToken: symbolTwo.address,
        amount: initAmount,
        returnAmount: resSymbolTwo.returnAmount,
        resSymbolTwo,
    });

    const resSymbolThree = await inch.getExpectedReturn({
        fromToken: symbolTwo.address,
        destToken: symbolThree.address,
        amount: resSymbolTwo.returnAmount,
    });

    console.log({
        fromToken: symbolTwo.address,
        destToken: symbolThree.address,
        amount: resSymbolTwo.returnAmount,
        returnAmount: resSymbolThree.returnAmount,
    });

    const resSymbolOne = await inch.getExpectedReturn({
        fromToken: symbolThree.address,
        destToken: symbolOne.address,
        amount: resSymbolThree.returnAmount,
    });

    console.log({
        fromToken: symbolThree.address,
        destToken: symbolOne.address,
        amount: resSymbolThree.returnAmount,
        returnAmount: resSymbolOne.returnAmount,
    });
}

async function getGasPrice({ web3 }) {
    const gasPrice = await web3.eth.getGasPrice();
    return gasPrice;
}

main();
