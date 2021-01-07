const inchABI = require('../../config/abi/inch.json');

class Inch {
    constructor({ web3, address }) {
        this.web3 = web3;
        this.address = address;
        this.contract = new this.web3.eth.Contract(inchABI, address);
    }

    async getExpectedReturn({
        fromToken, destToken, amount, parts = 10, flags = 0,
    }) {
        const res = await this.contract.methods.getExpectedReturn(fromToken, destToken, amount, parts, flags).call();
        return res;
    }
}

module.exports = Inch;
