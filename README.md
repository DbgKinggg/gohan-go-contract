# 🐵GohanGo!! NFT Official contract Repository🐵

## What is this?

This is a hardhat project which contain the smart contract we use for our GohanGo!! project, including script to deploy, to whitelist addresses and get verified on Etherscan.

This is really just a started project, you can do so much more with this, like writing some tests.

## Configure project

- Run `npm install` to install dependencies
- Copy `credentials.example.js` file and rename to `credentials.js`
- Fill in the credentials

Credential needed as follow: (Please do not expose these info to anyone)

- `alchemyRinkeby`: Alchemy API key for Rinkeby
- `alchemyMainnet`: Alchemy API key for Ethereum mainnet
- `alchemyGoerli`: Alchemy API key for Rinkeby (Only needed if you use Goerli)
- `privateKey`: The private key for the wallet that you want to use for interacting with smart contract
- `address`: the address of your wallet
- `etherscan`: Etherscan API key (Use for verifying your smart contract)

## Run scripts

You can use the following command to run your scripts (in the `scripts` folder) and target a specific network.

`npx hardhat run —-network <network> scripts/path`

For example, if I want to run a script on Rinkeby, I will do `npx hardhat run --network rinkeby scripts/path`

### Deploy your contract

Simply run: `hardhat run --network <network> scripts/gohango-deploy.js`, you can change the `action` flag to false to see the gas estimation

### Whitelist wallet addresses

While developing, I decided to use a mapping instead of using Merkle tree to do the whitelisting. A big reason is because different people have different mintable amount, it's going to be messy if we use Merkle Tree. But a big drawback in using mapping is the gas cost is insane.
If you would like to know how to save some gas, I recommend you have a read at [this](https://medium.com/donkeverse/hardcore-gas-savings-in-nft-minting-part-1-16c66a88c56a)

- Replace `contractAddress` with the contract address that you deployed
- use `addresses.csv` as a started, fill in addresses and the associated amount
- run `hardhat run --network <network> scripts/gohango-whitelist.js`
