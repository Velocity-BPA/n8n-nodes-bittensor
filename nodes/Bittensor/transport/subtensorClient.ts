/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Subtensor Client
 * 
 * Main client for interacting with the Bittensor Subtensor chain.
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { getNetworkConfig, NetworkType, SS58_PREFIX } from '../constants/networks';
import { PALLETS } from '../constants/pallets';
import { taoToRao } from '../utils/unitConverter';

/**
 * Connection options
 */
export interface SubtensorConnectionOptions {
	network: NetworkType | 'custom';
	wsEndpoint?: string;
	coldkeyMnemonic?: string;
	hotkeyMnemonic?: string;
	timeout?: number;
}

/**
 * Transaction result
 */
export interface TransactionResult {
	success: boolean;
	blockHash?: string;
	txHash?: string;
	events?: unknown[];
	error?: string;
}

/**
 * Subtensor Client Class
 */
export class SubtensorClient {
	private api: ApiPromise | null = null;
	private provider: WsProvider | null = null;
	private coldkey: KeyringPair | null = null;
	private hotkey: KeyringPair | null = null;
	private _network: NetworkType | 'custom';
	private wsEndpoint: string;
	private connected = false;

	constructor(options: SubtensorConnectionOptions) {
		this._network = options.network;
		const config = getNetworkConfig(options.network, options.wsEndpoint);
		this.wsEndpoint = options.wsEndpoint || config.wsEndpoint;
	}

	/**
	 * Get the connected network
	 */
	get network(): NetworkType | 'custom' {
		return this._network;
	}

	/**
	 * Connect to Subtensor
	 */
	async connect(): Promise<void> {
		if (this.connected && this.api) {
			return;
		}

		try {
			this.provider = new WsProvider(this.wsEndpoint);
			this.api = await ApiPromise.create({ provider: this.provider });
			await this.api.isReady;
			this.connected = true;
		} catch (error) {
			throw new Error(`Failed to connect to Subtensor: ${(error as Error).message}`);
		}
	}

	/**
	 * Disconnect from Subtensor
	 */
	async disconnect(): Promise<void> {
		if (this.api) {
			await this.api.disconnect();
		}
		if (this.provider) {
			await this.provider.disconnect();
		}
		this.connected = false;
		this.api = null;
		this.provider = null;
	}

	/**
	 * Initialize coldkey from mnemonic
	 */
	initColdkey(mnemonic: string): void {
		const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_PREFIX });
		this.coldkey = keyring.addFromMnemonic(mnemonic);
	}

	/**
	 * Initialize hotkey from mnemonic
	 */
	initHotkey(mnemonic: string): void {
		const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_PREFIX });
		this.hotkey = keyring.addFromMnemonic(mnemonic);
	}

	/**
	 * Ensure connected
	 */
	private ensureConnected(): ApiPromise {
		if (!this.api || !this.connected) {
			throw new Error('Not connected to Subtensor');
		}
		return this.api;
	}

	/**
	 * Get balance for an address
	 */
	async getBalance(address: string): Promise<bigint> {
		const api = this.ensureConnected();
		const account = await api.query.system.account(address);
		const data = (account as unknown as { data: { free: { toBigInt: () => bigint } } }).data;
		return data.free.toBigInt();
	}

	/**
	 * Get stake for coldkey-hotkey pair
	 */
	async getStake(coldkey: string, hotkey: string): Promise<bigint> {
		const api = this.ensureConnected();
		const stake = await api.query[PALLETS.SUBTENSOR_MODULE].Stake(hotkey, coldkey);
		return (stake as unknown as { toBigInt: () => bigint }).toBigInt();
	}

	/**
	 * Get total stake for a coldkey
	 */
	async getTotalColdkeyStake(coldkey: string): Promise<bigint> {
		const api = this.ensureConnected();
		const stake = await api.query[PALLETS.SUBTENSOR_MODULE].TotalColdkeyStake(coldkey);
		return (stake as unknown as { toBigInt: () => bigint }).toBigInt();
	}

	/**
	 * Get total stake for a hotkey
	 */
	async getTotalHotkeyStake(hotkey: string): Promise<bigint> {
		const api = this.ensureConnected();
		const stake = await api.query[PALLETS.SUBTENSOR_MODULE].TotalHotkeyStake(hotkey);
		return (stake as unknown as { toBigInt: () => bigint }).toBigInt();
	}

	/**
	 * Get current block number
	 */
	async getBlockNumber(): Promise<number> {
		const api = this.ensureConnected();
		const header = await api.rpc.chain.getHeader();
		return header.number.toNumber();
	}

	/**
	 * Get block hash by number
	 */
	async getBlockHash(blockNumber: number): Promise<string> {
		const api = this.ensureConnected();
		const hash = await api.rpc.chain.getBlockHash(blockNumber);
		return hash.toString();
	}

	/**
	 * Get total networks count
	 */
	async getTotalNetworks(): Promise<number> {
		const api = this.ensureConnected();
		const count = await api.query[PALLETS.SUBTENSOR_MODULE].TotalNetworks();
		return (count as unknown as { toNumber: () => number }).toNumber();
	}

	/**
	 * Get subnet info
	 */
	async getSubnetInfo(netuid: number): Promise<Record<string, unknown>> {
		const api = this.ensureConnected();
		const pallet = api.query[PALLETS.SUBTENSOR_MODULE];
		
		const [n, tempo, difficulty, immunityPeriod, maxValidators, minWeights, maxWeightLimit] = await Promise.all([
			pallet.SubnetworkN(netuid),
			pallet.Tempo(netuid),
			pallet.Difficulty(netuid),
			pallet.ImmunityPeriod(netuid),
			pallet.MaxAllowedValidators(netuid),
			pallet.MinAllowedWeights(netuid),
			pallet.MaxWeightLimit(netuid),
		]);

		return {
			netuid,
			n: (n as unknown as { toNumber: () => number }).toNumber(),
			tempo: (tempo as unknown as { toNumber: () => number }).toNumber(),
			difficulty: (difficulty as unknown as { toBigInt: () => bigint }).toBigInt().toString(),
			immunityPeriod: (immunityPeriod as unknown as { toNumber: () => number }).toNumber(),
			maxValidators: (maxValidators as unknown as { toNumber: () => number }).toNumber(),
			minAllowedWeights: (minWeights as unknown as { toNumber: () => number }).toNumber(),
			maxWeightLimit: (maxWeightLimit as unknown as { toNumber: () => number }).toNumber(),
		};
	}

	/**
	 * Get neuron info
	 */
	async getNeuronInfo(netuid: number, uid: number): Promise<Record<string, unknown>> {
		const api = this.ensureConnected();
		const pallet = api.query[PALLETS.SUBTENSOR_MODULE];

		const [hotkey, active, rank, trust, consensus, incentive, dividends, emission, validatorTrust, validatorPermit] = await Promise.all([
			pallet.Keys(netuid, uid),
			pallet.Active(netuid, uid),
			pallet.Rank(netuid, uid),
			pallet.Trust(netuid, uid),
			pallet.Consensus(netuid, uid),
			pallet.Incentive(netuid, uid),
			pallet.Dividends(netuid, uid),
			pallet.Emission(netuid, uid),
			pallet.ValidatorTrust(netuid, uid),
			pallet.ValidatorPermit(netuid, uid),
		]);

		const hotkeyStr = hotkey.toString();
		const stake = await this.getTotalHotkeyStake(hotkeyStr);

		return {
			uid,
			netuid,
			hotkey: hotkeyStr,
			active: (active as unknown as { isTrue?: boolean }).isTrue ?? false,
			rank: (rank as unknown as { toNumber: () => number }).toNumber(),
			trust: (trust as unknown as { toNumber: () => number }).toNumber(),
			consensus: (consensus as unknown as { toNumber: () => number }).toNumber(),
			incentive: (incentive as unknown as { toNumber: () => number }).toNumber(),
			dividends: (dividends as unknown as { toNumber: () => number }).toNumber(),
			emission: (emission as unknown as { toBigInt: () => bigint }).toBigInt().toString(),
			validatorTrust: (validatorTrust as unknown as { toNumber: () => number }).toNumber(),
			validatorPermit: (validatorPermit as unknown as { isTrue?: boolean }).isTrue ?? false,
			stake: stake.toString(),
		};
	}

	/**
	 * Get all delegates
	 */
	async getDelegates(): Promise<string[]> {
		const api = this.ensureConnected();
		const delegates = await api.query[PALLETS.SUBTENSOR_MODULE].Delegates.entries();
		return delegates.map(([key]) => {
			const hotkey = (key.args as unknown[])[0] as { toString: () => string };
			return hotkey.toString();
		});
	}

	/**
	 * Get delegate take rate
	 */
	async getDelegateTake(hotkey: string): Promise<number> {
		const api = this.ensureConnected();
		const take = await api.query[PALLETS.SUBTENSOR_MODULE].Delegates(hotkey);
		return (take as unknown as { toNumber: () => number }).toNumber();
	}

	/**
	 * Get registration cost (burn amount)
	 */
	async getRegistrationCost(netuid: number): Promise<bigint> {
		const api = this.ensureConnected();
		const burn = await api.query[PALLETS.SUBTENSOR_MODULE].Burn(netuid);
		return (burn as unknown as { toBigInt: () => bigint }).toBigInt();
	}

	/**
	 * Transfer TAO
	 */
	async transfer(to: string, amount: number): Promise<TransactionResult> {
		const api = this.ensureConnected();
		if (!this.coldkey) {
			throw new Error('Coldkey not initialized');
		}

		const amountRao = taoToRao(amount);
		
		return new Promise((resolve, reject) => {
			api.tx.balances
				.transferKeepAlive(to, amountRao)
				.signAndSend(this.coldkey!, ({ status, events, dispatchError }) => {
					if (status.isInBlock || status.isFinalized) {
						if (dispatchError) {
							resolve({ success: false, error: dispatchError.toString() });
						} else {
							resolve({
								success: true,
								blockHash: status.asInBlock?.toString() || status.asFinalized?.toString(),
								events: events.map(e => e.toHuman()),
							});
						}
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Add stake
	 */
	async addStake(hotkey: string, amount: number): Promise<TransactionResult> {
		const api = this.ensureConnected();
		if (!this.coldkey) {
			throw new Error('Coldkey not initialized');
		}

		const amountRao = taoToRao(amount);
		
		return new Promise((resolve, reject) => {
			api.tx[PALLETS.SUBTENSOR_MODULE]
				.addStake(hotkey, amountRao)
				.signAndSend(this.coldkey!, ({ status, events, dispatchError }) => {
					if (status.isInBlock || status.isFinalized) {
						if (dispatchError) {
							resolve({ success: false, error: dispatchError.toString() });
						} else {
							resolve({
								success: true,
								blockHash: status.asInBlock?.toString() || status.asFinalized?.toString(),
								events: events.map(e => e.toHuman()),
							});
						}
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Remove stake
	 */
	async removeStake(hotkey: string, amount: number): Promise<TransactionResult> {
		const api = this.ensureConnected();
		if (!this.coldkey) {
			throw new Error('Coldkey not initialized');
		}

		const amountRao = taoToRao(amount);
		
		return new Promise((resolve, reject) => {
			api.tx[PALLETS.SUBTENSOR_MODULE]
				.removeStake(hotkey, amountRao)
				.signAndSend(this.coldkey!, ({ status, events, dispatchError }) => {
					if (status.isInBlock || status.isFinalized) {
						if (dispatchError) {
							resolve({ success: false, error: dispatchError.toString() });
						} else {
							resolve({
								success: true,
								blockHash: status.asInBlock?.toString() || status.asFinalized?.toString(),
								events: events.map(e => e.toHuman()),
							});
						}
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Set weights (validator only)
	 */
	async setWeights(netuid: number, uids: number[], weights: number[], versionKey: number): Promise<TransactionResult> {
		const api = this.ensureConnected();
		if (!this.hotkey) {
			throw new Error('Hotkey not initialized');
		}

		return new Promise((resolve, reject) => {
			api.tx[PALLETS.SUBTENSOR_MODULE]
				.setWeights(netuid, uids, weights, versionKey)
				.signAndSend(this.hotkey!, ({ status, events, dispatchError }) => {
					if (status.isInBlock || status.isFinalized) {
						if (dispatchError) {
							resolve({ success: false, error: dispatchError.toString() });
						} else {
							resolve({
								success: true,
								blockHash: status.asInBlock?.toString() || status.asFinalized?.toString(),
								events: events.map(e => e.toHuman()),
							});
						}
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Burned register on subnet
	 */
	async burnedRegister(netuid: number): Promise<TransactionResult> {
		const api = this.ensureConnected();
		if (!this.coldkey || !this.hotkey) {
			throw new Error('Both coldkey and hotkey required for registration');
		}

		return new Promise((resolve, reject) => {
			api.tx[PALLETS.SUBTENSOR_MODULE]
				.burnedRegister(netuid, this.hotkey!.address)
				.signAndSend(this.coldkey!, ({ status, events, dispatchError }) => {
					if (status.isInBlock || status.isFinalized) {
						if (dispatchError) {
							resolve({ success: false, error: dispatchError.toString() });
						} else {
							resolve({
								success: true,
								blockHash: status.asInBlock?.toString() || status.asFinalized?.toString(),
								events: events.map(e => e.toHuman()),
							});
						}
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Subscribe to new blocks
	 */
	async subscribeToBlocks(callback: (blockNumber: number) => void): Promise<() => void> {
		const api = this.ensureConnected();
		const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
			callback(header.number.toNumber());
		});
		return unsubscribe as unknown as () => void;
	}

	/**
	 * Subscribe to events
	 */
	async subscribeToEvents(callback: (events: unknown[]) => void): Promise<() => void> {
		const api = this.ensureConnected();
		const unsubscribe = await api.query.system.events((events: { toHuman: () => unknown }) => {
			callback(events.toHuman() as unknown[]);
		});
		return unsubscribe as unknown as () => void;
	}
}

/**
 * Create and connect a new client
 */
export async function createSubtensorClient(options: SubtensorConnectionOptions): Promise<SubtensorClient> {
	const client = new SubtensorClient(options);
	await client.connect();
	return client;
}
