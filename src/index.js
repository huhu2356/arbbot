const Web3 = require('web3');
const { ChainId, Token, WETH, Fetcher, Route } = require('@uniswap/sdk');
const BigNumber = require('bignumber.js');

const config = require('../config/index');
const Matcha = require('./dex/matcha');
const Inch = require('./dex/inch');

async function main() {
    const { infura, inch: inchConfig, matcha: matchaConfig, pair, initAmount } = config;
    const web3 = new Web3(infura);
    const matcha = new Matcha(matchaConfig);
    const inch = new Inch({ web3, address: inchConfig.address });
    searchArbOpp({ web3, pair, matcha, inch, initAmount });
}

// Triangular Arbitrage: one -> two -> three -> one
// eg: sell ETH buy LINK by Matcha -> sell LINK buy DAI by Matcha -> sell DAI buy ETH by Matcha
async function searchArbOpp({ web3, pair, matcha, inch, initAmount }) {
    const [symbolOne, symbolTwo, symbolThree] = pair;

    const resSymbolTwo = await matcha.getSwapQuote({
        fromToken: symbolOne.symbol,
        destToken: symbolTwo.symbol,
        amount: initAmount,
    });
    const feeOfFirstTurn = new BigNumber(resSymbolTwo.gas).multipliedBy(resSymbolTwo.gasPrice);

    // const symbolThreePrice = await getUniswapPrice({
    //     fromToken: symbolTwo,
    //     destToken: symbolThree,
    // });
    // const symbolThreeAmount = new BigNumber(symbolThreePrice).multipliedBy(resSymbolTwo.buyAmount);
    // console.log('symbolThreePrice', symbolThreePrice, symbolThreeAmount.toFixed());

    const resSymbolThree = await matcha.getSwapQuote({
        fromToken: symbolTwo.symbol,
        destToken: symbolThree.symbol,
        amount: resSymbolTwo.buyAmount,
    });
    const feeOfSecTurn = new BigNumber(resSymbolThree.gas).multipliedBy(resSymbolThree.gasPrice);

    const resSymbolOne = await matcha.getSwapQuote({
        fromToken: symbolThree.symbol,
        destToken: symbolOne.symbol,
        amount: resSymbolThree.buyAmount,
    });
    const feeOfTrdTurn = new BigNumber(resSymbolOne.gas).multipliedBy(resSymbolOne.gasPrice)

    if (new BigNumber(resSymbolOne.buyAmount).isGreaterThan(initAmount)) {
        const totalFee = web3.utils.fromWei(feeOfFirstTurn.plus(feeOfSecTurn).plus(feeOfTrdTurn).toString());
        const input = web3.utils.fromWei(initAmount);
        const output = web3.utils.fromWei(resSymbolOne.buyAmount);
        console.log(`trade arbitrage opportunity: input amount ${input}, output amount ${output}`);
        console.log(`total tx fee: ${totalFee.toString()}`);
    }

    searchArbOpp({ web3, pair, matcha, inch, initAmount });
}

async function getUniswapPrice({ fromToken, destToken }) {
    let fromTokenInstance = new Token(ChainId.MAINNET, fromToken.address, fromToken.decimals);
    let destTokenInstance = new Token(ChainId.MAINNET, destToken.address, destToken.decimals);
    if (fromToken.symbol === 'ETH') {
        fromTokenInstance = WETH[ChainId.MAINNET];
    }
    if (destToken.symbol === 'ETH') {
        destTokenInstance = WETH[ChainId.MAINNET];
    }
    const pair = await Fetcher.fetchPairData(fromTokenInstance, destTokenInstance);
    const route = new Route([pair], fromTokenInstance)
    return route.midPrice.toSignificant(6);
}

async function getGasPrice({ web3 }) {
    const gasPrice = await web3.eth.getGasPrice();
    return gasPrice;
}

main();
