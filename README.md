# n8n-nodes-bittensor

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with the Bittensor decentralized AI network. This node provides access to 5 core resources including subnet management, validator operations, staking mechanisms, delegation processes, and network monitoring capabilities for building automated workflows with the Bittensor ecosystem.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Bittensor](https://img.shields.io/badge/Bittensor-Network-orange)
![AI](https://img.shields.io/badge/AI-Decentralized-green)
![Blockchain](https://img.shields.io/badge/Blockchain-TAO-purple)

## Features

- **Subnet Management** - Create, monitor, and manage Bittensor subnets with automated workflows
- **Validator Operations** - Register, query, and manage validator nodes across the network
- **Staking Integration** - Automate staking operations and monitor staking rewards
- **Delegation Control** - Manage stake delegation to validators with automated rebalancing
- **Network Monitoring** - Track network metrics, subnet performance, and validator statistics
- **Real-time Data** - Access live network data for informed decision making
- **Batch Operations** - Perform bulk operations across multiple subnets and validators
- **Error Recovery** - Built-in retry mechanisms and error handling for network operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bittensor`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-bittensor
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-bittensor.git
cd n8n-nodes-bittensor
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bittensor
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Bittensor network API key for authentication | Yes |
| Network | Target network (mainnet/testnet) | Yes |
| Endpoint | Custom endpoint URL (optional) | No |

## Resources & Operations

### 1. Subnet

| Operation | Description |
|-----------|-------------|
| Create | Create a new subnet on the Bittensor network |
| Get | Retrieve subnet information and metadata |
| List | Get all subnets with filtering options |
| Update | Modify subnet parameters and configuration |
| Delete | Remove a subnet from the network |
| Get Metrics | Retrieve subnet performance metrics |

### 2. Validator

| Operation | Description |
|-----------|-------------|
| Register | Register a new validator node |
| Get | Get validator details and status |
| List | List validators with filtering by subnet |
| Update | Update validator configuration |
| Deregister | Remove validator from network |
| Get Performance | Retrieve validator performance data |
| Set Weights | Update validator weights |

### 3. Staking

| Operation | Description |
|-----------|-------------|
| Stake | Stake TAO tokens to validators |
| Unstake | Remove staked tokens |
| Get Balance | Check staking balance |
| Get Rewards | Retrieve staking rewards history |
| Get History | Get complete staking transaction history |
| Claim Rewards | Claim pending staking rewards |

### 4. Delegation

| Operation | Description |
|-----------|-------------|
| Delegate | Delegate stake to a validator |
| Undelegate | Remove delegation from validator |
| Get Delegations | List all active delegations |
| Transfer | Transfer delegation between validators |
| Get Returns | Calculate delegation returns |
| Rebalance | Automatically rebalance delegations |

### 5. Network

| Operation | Description |
|-----------|-------------|
| Get Status | Get overall network status |
| Get Metrics | Retrieve network-wide metrics |
| Get Blocks | Get recent block information |
| Get Transactions | List recent transactions |
| Get Difficulty | Get current mining difficulty |
| Get Supply | Get total TAO supply information |

## Usage Examples

```javascript
// Create a new subnet
{
  "name": "AI Training Subnet",
  "netuid": 42,
  "tempo": 100,
  "immunity_period": 7200
}
```

```javascript
// Stake TAO to a validator
{
  "validator_hotkey": "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
  "amount": 1000,
  "subnet_id": 1
}
```

```javascript
// Query network metrics
{
  "metrics": ["total_stake", "active_validators", "subnet_count"],
  "timeframe": "24h"
}
```

```javascript
// Delegate stake with auto-rebalancing
{
  "validators": [
    {"hotkey": "5GNJq...", "percentage": 60},
    {"hotkey": "5HKLp...", "percentage": 40}
  ],
  "total_amount": 5000,
  "auto_rebalance": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed | Verify API key in credentials |
| Network Timeout | Request timed out | Check network connectivity and retry |
| Insufficient Balance | Not enough TAO for operation | Check wallet balance before staking |
| Validator Not Found | Validator hotkey invalid | Verify validator exists and is active |
| Subnet Full | No available slots in subnet | Wait for slot availability or try another subnet |
| Rate Limit Exceeded | Too many requests | Implement delays between requests |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
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
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bittensor/issues)
- **Bittensor Docs**: [Bittensor Documentation](https://docs.bittensor.com)
- **Community**: [Bittensor Discord](https://discord.gg/bittensor)