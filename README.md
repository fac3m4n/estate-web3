# Estate-web3 🏠

A decentralized real estate platform built on Arbitrum Sepolia that enables property listing, buying, and renting with cryptocurrency payments and smart contract integration.

Landing inspiration: [Figma](https://www.figma.com/community/file/1159150161670385658/free-estatery-real-estate-saas-web-and-mobile-ui-kit)

## Features 🌟

- Property Listing & Management
- Buy/Rent Properties with Cryptocurrency
- Smart Contract-based Transactions
- Fractional Property Ownership
- Collateralized Payments Support
- Interactive Property Search
- Secure Wallet Integration
- Debug and Test Deployed Contracts

## Tech Stack 💻

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, DaisyUI, Google Maps API
- **Blockchain**: Hardhat, Arbitrum Sepolia, Solidity
- **Web3 Integration**: Wagmi, Viem, RainbowKit
- **File Storage**: Pinata IPFS
- **Database**: MongoDB, Prisma
- **Development Tools**: Yarn, Prettier, ESLint

## Contracts 📜

- **tUSD.sol**: Test USD token on Arbitrum Sepolia used for transactions on the platform
- **PropertyNFT.sol**: Represents a property as NFT and manages its ownership and transfer.
- **Marketplace.sol**: Manages the buying and selling of properties, including the creation of listings, bidding, and settlement.
- **MarketplaceFractional.sol**: Manages the fractional ownership of properties, including the creation of fractional listings, bidding, and settlement.

## Requirements 📝

- Node.js (>=v18.18)
- Yarn (v1 or v2+)
- Git

## Installation 📥

1. Clone the repository
2. Run `yarn install` to install the dependencies
3. Run `yarn deploy --network <network>` to deploy the contracts
4. Run `yarn start` to start the development server
