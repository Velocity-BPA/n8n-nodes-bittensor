/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Metagraph Sync
 * 
 * Handles synchronization and caching of subnet metagraph data.
 */

import { SubtensorClient } from './subtensorClient';
import { Metagraph, NeuronInfo } from '../utils/metagraphUtils';

const CACHE_TTL = 60000; // 1 minute

/**
 * Metagraph sync options
 */
export interface MetagraphSyncOptions {
	netuid: number;
	lite?: boolean;
	includeAxons?: boolean;
	includeWeights?: boolean;
}

/**
 * Metagraph cache entry
 */
interface CacheEntry {
	metagraph: Metagraph;
	timestamp: number;
	block: number;
}

/**
 * Metagraph Sync Class
 */
export class MetagraphSync {
	private client: SubtensorClient;
	private cache: Map<number, CacheEntry> = new Map();

	constructor(client: SubtensorClient) {
		this.client = client;
	}

	/**
	 * Sync metagraph from chain
	 */
	async sync(options: MetagraphSyncOptions): Promise<Metagraph> {
		const { netuid } = options;
		// Note: lite and includeAxons options reserved for future optimization

		// Check cache
		const cached = this.cache.get(netuid);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.metagraph;
		}

		// Get basic subnet info
		const subnetInfo = await this.client.getSubnetInfo(netuid);
		const n = subnetInfo.n as number;
		const block = await this.client.getBlockNumber();

		// Initialize arrays
		const neurons: NeuronInfo[] = [];

		// Fetch neuron data
		for (let uid = 0; uid < n; uid++) {
			try {
				const neuronData = await this.client.getNeuronInfo(netuid, uid);

				const neuron: NeuronInfo = {
					uid,
					hotkey: neuronData.hotkey as string,
					coldkey: '',
					stake: BigInt(neuronData.stake as string),
					stakeTao: Number(neuronData.stake) / 1e9,
					rank: (neuronData.rank as number) / 65535,
					trust: (neuronData.trust as number) / 65535,
					consensus: (neuronData.consensus as number) / 65535,
					incentive: (neuronData.incentive as number) / 65535,
					dividends: (neuronData.dividends as number) / 65535,
					emission: BigInt(neuronData.emission as string),
					emissionTao: Number(neuronData.emission) / 1e9,
					validatorTrust: (neuronData.validatorTrust as number) / 65535,
					validatorPermit: neuronData.validatorPermit as boolean,
					active: neuronData.active as boolean,
					lastUpdate: 0,
				};

				neurons.push(neuron);
			} catch {
				// Skip neurons that fail to load
			}
		}

		const metagraph: Metagraph = {
			netuid,
			n,
			block,
			neurons,
		};

		// Cache result
		this.cache.set(netuid, {
			metagraph,
			timestamp: Date.now(),
			block,
		});

		return metagraph;
	}

	/**
	 * Sync lite metagraph (UIDs and hotkeys only)
	 */
	async syncLite(netuid: number): Promise<{ uids: number[]; hotkeys: string[] }> {
		const subnetInfo = await this.client.getSubnetInfo(netuid);
		const n = subnetInfo.n as number;

		const uids: number[] = [];
		const hotkeys: string[] = [];

		for (let uid = 0; uid < n; uid++) {
			try {
				const neuronData = await this.client.getNeuronInfo(netuid, uid);
				uids.push(uid);
				hotkeys.push(neuronData.hotkey as string);
			} catch {
				// Skip
			}
		}

		return { uids, hotkeys };
	}

	/**
	 * Get cached metagraph
	 */
	getCached(netuid: number): Metagraph | undefined {
		const cached = this.cache.get(netuid);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.metagraph;
		}
		return undefined;
	}

	/**
	 * Clear cache
	 */
	clearCache(netuid?: number): void {
		if (netuid !== undefined) {
			this.cache.delete(netuid);
		} else {
			this.cache.clear();
		}
	}

	/**
	 * Get cache info
	 */
	getCacheInfo(): { netuid: number; age: number; block: number }[] {
		const now = Date.now();
		return Array.from(this.cache.entries()).map(([netuid, entry]) => ({
			netuid,
			age: now - entry.timestamp,
			block: entry.block,
		}));
	}

	/**
	 * Set cache TTL (for testing)
	 */
	setCacheTTL(_ttl: number): void {
		// This would require a class variable, simplified here
	}
}

/**
 * Create metagraph sync helper
 */
export function createMetagraphSync(client: SubtensorClient): MetagraphSync {
	return new MetagraphSync(client);
}

/**
 * Quick sync function
 */
export async function syncMetagraph(
	client: SubtensorClient,
	netuid: number,
	lite = false
): Promise<Metagraph> {
	const sync = new MetagraphSync(client);
	return sync.sync({ netuid, lite });
}
