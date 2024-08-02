//https://eth-sepolia.g.alchemy.com/v2/Z2Vjl_1OidpOYGIENfc1us9F-W5xK5w1
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/Z2Vjl_1OidpOYGIENfc1us9F-W5xK5w1',
      accounts: ['2d5f68eaf41ef5eb8edbae6420ff418be370b7a1453f61249bbd38d226007323'],
    },
  },
};