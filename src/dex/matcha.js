const got = require('got');

class Matcha {
    constructor(config) {
        this.host = config.host;
    }

    async getSwapQuote({
        fromToken, destToken, amount,
    }) {
        const url = `${this.host}/swap/v1/quote`;
        const searchParams = {
            buyToken: destToken,
            sellToken: fromToken,
            sellAmount: amount,
        };

        const { body } = await got.get(url, {
            searchParams,
            responseType: 'json',
        });

        return body;
    }
}

module.exports = Matcha;
