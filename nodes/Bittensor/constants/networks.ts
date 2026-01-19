/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Bittensor Network Configuration
 */

export type NetworkType = 'finney' | 'testnet' | 'local';

export interface NetworkConfig {
	name: string;
	wsEndpoint: string;
	httpEndpoint?: string;
	explorerUrl?: string;
	chainId?: string;
}

/**
 * Network Configurations
 */
export const NETWORKS: Record<NetworkType, NetworkConfig> = {
	finney: {
		name: 'Finney (Mainnet)',
		wsEndpoint: 'wss://entrypoint-finney.opentensor.ai:443',
		explorerUrl: 'https://taostats.io',
	},
	testnet: {
		name: 'Testnet',
		wsEndpoint: 'wss://test.finney.opentensor.ai:443',
		explorerUrl: 'https://test.taostats.io',
	},
	local: {
		name: 'Local',
		wsEndpoint: 'ws://127.0.0.1:9944',
	},
};

/**
 * Bittensor Constants
 */
export const SS58_PREFIX = 42;
export const TAO_DECIMALS = 9;
export const RAO_PER_TAO = BigInt(1_000_000_000);

/**
 * Block Time Constants
 */
export const BLOCK_TIME_SECONDS = 12;
export const BLOCKS_PER_HOUR = 300;
export const BLOCKS_PER_DAY = 7200;

/**
 * Get network configuration
 */
export function getNetworkConfig(network: NetworkType | 'custom', customEndpoint?: string): NetworkConfig {
	if (network === 'custom') {
		return {
			name: 'Custom',
			wsEndpoint: customEndpoint || 'ws://127.0.0.1:9944',
		};
	}
	return NETWORKS[network];
}
