# n8n-nodes-bittensor

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with the Bittensor decentralized AI network. This node provides 5 core resources enabling automation of staking operations, delegation management, subnet monitoring, validator tracking, and network analytics within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Bittensor](https://img.shields.io/badge/Bittensor-Compatible-green)
![TAO](https://img.shields.io/badge/TAO-Supported-orange)
![Subtensor](https://img.shields.io/badge/Subtensor-Ready-purple)

## Features

- **Staking Operations** - Automate TAO staking, unstaking, and stake management across validators
- **Delegation Management** - Monitor and manage delegate performance, rewards, and nominations
- **Subnet Analytics** - Track subnet metrics, registration costs, and performance data
- **Validator Monitoring** - Real-time validator statistics, rankings, and emission tracking
- **Network Insights** - Access network-wide statistics, block data, and consensus metrics
- **Multi-Network Support** - Compatible with mainnet, testnet, and custom Bittensor networks
- **Real-time Data** - Live blockchain data with configurable refresh intervals
- **Automated Alerts** - Set up notifications for stake changes, validator events, and network updates

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
| API Key | Your Bittensor API key for authenticated requests | Yes |
| Network | Target network (mainnet, testnet, custom) | Yes |
| RPC Endpoint | Custom RPC endpoint URL (if using custom network) | No |
| Wallet Address | Your wallet address for stake operations | No |

## Resources & Operations

### 1. Staking

| Operation | Description |
|-----------|-------------|
| Add Stake | Stake TAO tokens to a specific validator |
| Remove Stake | Unstake TAO tokens from a validator |
| Get Stake Info | Retrieve current stake information for an address |
| List Stakes | Get all active stakes for a wallet |
| Calculate Rewards | Estimate staking rewards for a given amount |
| Get Stake History | Retrieve historical staking transactions |

### 2. Delegation

| Operation | Description |
|-----------|-------------|
| Delegate | Delegate TAO tokens to a validator |
| Undelegate | Remove delegation from a validator |
| Get Delegations | List all active delegations |
| Delegate Performance | Get performance metrics for delegates |
| Calculate Delegation Rewards | Estimate delegation rewards |
| Get Delegate Info | Retrieve detailed delegate information |

### 3. Subnets

| Operation | Description |
|-----------|-------------|
| List Subnets | Get all available subnets |
| Get Subnet Info | Retrieve detailed subnet information |
| Get Registration Cost | Get current registration cost for a subnet |
| Get Subnet Metrics | Retrieve performance metrics for a subnet |
| List Subnet Validators | Get all validators in a specific subnet |
| Get Subnet Emissions | Retrieve emission data for a subnet |

### 4. Validators

| Operation | Description |
|-----------|-------------|
| List Validators | Get all validators with basic information |
| Get Validator Info | Retrieve detailed validator information |
| Get Validator Performance | Get performance metrics for a validator |
| Get Validator Emissions | Retrieve emission history for a validator |
| Check Validator Status | Get current online/offline status |
| Get Validator Rankings | Retrieve validator rankings by various metrics |

### 5. Network

| Operation | Description |
|-----------|-------------|
| Get Network Stats | Retrieve overall network statistics |
| Get Block Info | Get information about a specific block |
| Get Latest Block | Retrieve the most recent block data |
| Get Network Parameters | Get current network configuration parameters |
| Get Total Issuance | Retrieve total TAO token supply information |
| Get Consensus Data | Access current consensus mechanism data |

## Usage Examples

```javascript
// Example 1: Check validator performance before staking
const validatorInfo = await this.helpers.request({
  method: 'GET',
  url: '/validators/5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});

if (validatorInfo.performance_score > 0.8) {
  // Proceed with staking 100 TAO
  const stakeResult = await this.helpers.request({
    method: 'POST',
    url: '/staking/add',
    body: {
      validator_address: '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
      amount: 100,
      wallet_address: credentials.walletAddress
    }
  });
}
```

```javascript
// Example 2: Monitor subnet registration opportunities
const subnets = await this.helpers.request({
  method: 'GET',
  url: '/subnets',
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});

const affordableSubnets = subnets.filter(subnet => 
  subnet.registration_cost <= 1000 && subnet.available_slots > 0
);

for (const subnet of affordableSubnets) {
  console.log(`Subnet ${subnet.netuid}: ${subnet.registration_cost} TAO, ${subnet.available_slots} slots`);
}
```

```javascript
// Example 3: Track delegation rewards across multiple validators
const delegations = await this.helpers.request({
  method: 'GET',
  url: '/delegations',
  params: {
    wallet_address: credentials.walletAddress
  }
});

let totalRewards = 0;
for (const delegation of delegations) {
  const rewards = await this.helpers.request({
    method: 'GET',
    url: `/delegations/${delegation.id}/rewards`,
    params: {
      period: '30d'
    }
  });
  totalRewards += rewards.total_rewards;
}

console.log(`Total delegation rewards (30 days): ${totalRewards} TAO`);
```

```javascript
// Example 4: Network health monitoring
const networkStats = await this.helpers.request({
  method: 'GET',
  url: '/network/stats'
});

const alertThresholds = {
  minValidators: 1000,
  maxBlockTime: 12,
  minNetworkStake: 100000
};

if (networkStats.active_validators < alertThresholds.minValidators) {
  // Trigger alert workflow
  this.emit('low-validator-count', networkStats);
}

if (networkStats.avg_block_time > alertThresholds.maxBlockTime) {
  // Trigger slow network alert
  this.emit('slow-network', networkStats);
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or missing API key | Verify API key in credentials setup |
| 403 Insufficient Funds | Not enough TAO for staking operation | Check wallet balance and reduce stake amount |
| 404 Validator Not Found | Invalid validator address provided | Verify validator address exists on network |
| 429 Rate Limit Exceeded | Too many API requests in time window | Implement request throttling or increase delays |
| 500 Network Error | Bittensor network connectivity issues | Check network status and retry operation |
| 503 Node Unavailable | RPC node temporarily unavailable | Switch to backup RPC endpoint or retry later |

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
- **Bittensor Docs**: [Bittensor Documentation](https://docs.bittensor.com/)
- **Community**: [Bittensor Discord](https://discord.gg/bittensor)