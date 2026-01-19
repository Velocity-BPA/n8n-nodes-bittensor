# n8n-nodes-bittensor

> [!IMPORTANT]
> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node package for the **Bittensor** blockchain network. This marketplace-ready toolkit enables seamless integration with the Bittensor decentralized AI network, supporting TAO staking, delegation, subnet queries, validator operations, and AI network interactions.

![Bittensor](https://img.shields.io/badge/Bittensor-TAO-00D4AA?style=flat-square)
![n8n](https://img.shields.io/badge/n8n-community%20node-FF6D5A?style=flat-square)
![License](https://img.shields.io/badge/license-BSL--1.1-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)

## Features

### 16 Resource Categories with 80+ Operations

| Resource | Description |
|----------|-------------|
| **Wallet** | Balance queries, TAO transfers, address validation, transaction history |
| **Staking** | Stake management, APY calculations, delegation tracking |
| **Delegation** | Delegate discovery, take rates, nominator management |
| **Subnet** | Subnet info, hyperparameters, neuron lists, registration costs |
| **Neuron** | UID/hotkey lookups, active neuron discovery, performance metrics |
| **Registration** | Burned registration, cost queries, status checks |
| **Validator** | Validator info, weights, bonds, performance metrics |
| **Miner** | Miner info, axon endpoints, incentives, trust scores |
| **Metagraph** | Full/lite metagraph sync, UIDs, hotkeys, stake matrices |
| **Weights** | Weight queries, setting, validation, commit/reveal |
| **Query** | AI subnet queries, text/image generation, custom inference |
| **Root** | Root network info, senate, emission schedules |
| **Governance** | Proposals, voting, senate management |
| **Block** | Block queries, chain info, event monitoring |
| **Emission** | Supply stats, emission distribution, halving schedules |
| **Utility** | RAO/TAO conversion, address encoding, mnemonic generation |

### Three Credential Types

1. **Bittensor Network** - Subtensor connection with coldkey/hotkey support
2. **Bittensor API** - Taostats and explorer API integration
3. **Subnet Credentials** - Subnet-specific endpoints and model access

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bittensor`
5. Click **Install**

### Manual Installation

```bash
# Navigate to n8n custom nodes directory
cd ~/.n8n/custom

# Clone or extract the package
git clone https://github.com/Velocity-BPA/n8n-nodes-bittensor.git
cd n8n-nodes-bittensor

# Install dependencies and build
npm install
npm run build

# Restart n8n
```

### Development Installation

```bash
# Extract the zip file
unzip n8n-nodes-bittensor.zip
cd n8n-nodes-bittensor

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bittensor

# Restart n8n
n8n start
```

## Credentials Setup

### Bittensor Network Credentials

| Field | Description |
|-------|-------------|
| Network | Select network (Finney, Testnet, Local, Custom) |
| WebSocket Endpoint | Custom WebSocket URL (for custom network) |
| Authentication Type | Read Only, Coldkey, Hotkey, or Both |
| Coldkey Mnemonic | 12/24 word mnemonic for main wallet |
| Hotkey Mnemonic | 12/24 word mnemonic for operational key |

### Bittensor API Credentials

| Field | Description |
|-------|-------------|
| API Provider | Taostats, Bittensor Explorer, or Custom |
| API Key | API key for the provider |
| Rate Limit | Maximum requests per second |

### Subnet Credentials

| Field | Description |
|-------|-------------|
| Subnet | Select known subnet or custom |
| Custom Subnet UID | Netuid for custom subnet |
| Validator Endpoint | Optional validator endpoint |
| Miner Endpoint | Optional direct miner endpoint |
| Query Timeout | Timeout for subnet queries |

## Resources & Operations

### Wallet Operations
- **Get Balance** - Query TAO balance for any address
- **Get Stake** - Get stake amount for coldkey-hotkey pair
- **Get Overview** - Complete wallet overview with balance and stakes
- **Transfer** - Send TAO to another address
- **Validate Address** - Verify Bittensor address format
- **Get Transfer History** - Transaction history via Taostats API

### Staking Operations
- **Get Stake Info** - Detailed staking information
- **Add Stake** - Delegate TAO to a validator/hotkey
- **Remove Stake** - Undelegate TAO from a hotkey
- **Get Stakes by Coldkey** - All stakes for a coldkey
- **Calculate APY** - Estimated annual percentage yield

### Subnet Operations
- **Get All Subnets** - List all registered subnets
- **Get Subnet Info** - Detailed subnet information
- **Get Hyperparameters** - Subnet configuration parameters
- **Get Subnet Neurons** - List neurons in a subnet
- **Get Registration Cost** - Current burn cost to register

### Metagraph Operations
- **Get Full Metagraph** - Complete metagraph data
- **Get Metagraph Lite** - Lightweight version (UIDs and hotkeys)
- **Get UIDs** - All UIDs in a subnet
- **Get Hotkeys** - All hotkeys in a subnet

### Utility Operations
- **RAO to TAO** - Convert smallest unit to TAO
- **TAO to RAO** - Convert TAO to RAO
- **Validate Address** - Check address validity
- **Generate Mnemonic** - Create new wallet mnemonic

## Usage Examples

### Check Wallet Balance

```json
{
  "resource": "wallet",
  "operation": "getBalance",
  "address": "5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX"
}
```

### Get Subnet Info

```json
{
  "resource": "subnet",
  "operation": "getSubnetInfo",
  "netuid": 1
}
```

### Convert RAO to TAO

```json
{
  "resource": "utility",
  "operation": "raoToTao",
  "amountRao": "1000000000"
}
```

## Bittensor Concepts

| Term | Description |
|------|-------------|
| **TAO** | Native token of Bittensor network |
| **RAO** | Smallest unit (1 TAO = 10^9 RAO) |
| **Coldkey** | Main wallet key that holds TAO |
| **Hotkey** | Operational key for running neurons |
| **Subnet** | Specialized AI network (netuid) |
| **Neuron** | Miner or validator on a subnet |
| **Metagraph** | Network state snapshot |
| **Axon** | Miner's queryable endpoint |
| **Tempo** | Epoch length for subnet |
| **Emission** | TAO rewards distribution |

## Networks

| Network | WebSocket Endpoint |
|---------|-------------------|
| Finney (Mainnet) | wss://entrypoint-finney.opentensor.ai:443 |
| Testnet | wss://test.finney.opentensor.ai:443 |
| Local | ws://127.0.0.1:9944 |

## Error Handling

The node provides descriptive error messages for common issues:

- **Connection Errors** - Network unreachable or invalid endpoint
- **Authentication Errors** - Invalid mnemonic or missing keys
- **Validation Errors** - Invalid addresses or parameters
- **Transaction Errors** - Insufficient balance or failed transactions

## Security Best Practices

1. **Never share mnemonics** - Keep coldkey and hotkey mnemonics secure
2. **Use read-only mode** - For queries that don't require signing
3. **Test on testnet first** - Verify workflows before mainnet
4. **Validate addresses** - Always validate before transfers
5. **Check registration costs** - Verify burn amounts before registering

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- n8n installed locally

### Setup

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-bittensor.git
cd n8n-nodes-bittensor

# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes
npm run dev

# Lint code
npm run lint

# Run tests
npm test
```

### Project Structure

```
n8n-nodes-bittensor/
├── credentials/              # Credential types
├── nodes/Bittensor/          # Main node
│   ├── constants/            # Network configs, subnets
│   ├── transport/            # API clients
│   └── utils/                # Helpers
├── test/                     # Test files
├── scripts/                  # Build scripts
└── package.json
```

## Author

**Velocity BPA**

- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm test`)
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bittensor/issues)
- **Documentation**: [Bittensor Docs](https://docs.bittensor.com)
- **Community**: [Bittensor Discord](https://discord.gg/bittensor)

## Acknowledgments

- [Bittensor](https://bittensor.com) - Decentralized AI Network
- [n8n](https://n8n.io) - Workflow Automation Platform
- [Polkadot.js](https://polkadot.js.org) - Substrate/Polkadot API
- [Taostats](https://taostats.io) - Bittensor Analytics

---

<p align="center">
  Made with ❤️ for the Bittensor Community
</p>
