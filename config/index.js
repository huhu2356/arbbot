const config = {
    infura: 'https://mainnet.infura.io/v3/a749d8205a63413884d3e5a81f9b4aad',
    inch: {
        address: '0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E',
    },
    matcha: {
        host: 'https://api.0x.org',
    },
    pair: [{
        symbol: 'ETH',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
    },
    {
        symbol: 'LINK',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18,
    },
    {
        symbol: 'DAI',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
    }],
    initAmount: "1000000000000000000", // 1 ETH
};

module.exports = config;
