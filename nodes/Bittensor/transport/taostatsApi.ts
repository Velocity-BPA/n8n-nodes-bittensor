/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Taostats API Client
 * 
 * Client for interacting with the Taostats analytics API.
 */

import axios, { AxiosInstance } from 'axios';

const TAOSTATS_BASE_URL = 'https://api.taostats.io/api/v1';

/**
 * Price data response
 */
export interface TaostatsPriceData {
	price: number;
	price24hChange: number;
	marketCap: number;
	volume24h: number;
	circulatingSupply: number;
	totalSupply: number;
}

/**
 * Validator info from Taostats
 */
export interface TaostatsValidator {
	hotkey: string;
	coldkey: string;
	stake: string;
	delegatedStake: string;
	take: number;
	nominators: number;
	apr: number;
	rank: number;
}

/**
 * Subnet info from Taostats
 */
export interface TaostatsSubnet {
	netuid: number;
	name: string;
	emission: number;
	neurons: number;
	tempo: number;
	difficulty: string;
}

/**
 * Historical price point
 */
export interface PricePoint {
	timestamp: number;
	price: number;
	volume: number;
}

/**
 * Taostats API client
 */
export class TaostatsApiClient {
	private client: AxiosInstance;
	private _apiKey?: string;

	constructor(apiKey?: string) {
		this._apiKey = apiKey;
		this.client = axios.create({
			baseURL: TAOSTATS_BASE_URL,
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
				...(apiKey && { 'X-API-Key': apiKey }),
			},
		});
	}

	/**
	 * Check if API key is configured
	 */
	get hasApiKey(): boolean {
		return !!this._apiKey;
	}

	/**
	 * Get TAO price data
	 */
	async getPriceData(): Promise<TaostatsPriceData> {
		const response = await this.client.get('/price');
		return response.data;
	}

	/**
	 * Get validators list
	 */
	async getValidators(limit = 100, offset = 0): Promise<TaostatsValidator[]> {
		const response = await this.client.get('/validators', {
			params: { limit, offset },
		});
		return response.data;
	}

	/**
	 * Get subnet list
	 */
	async getSubnets(): Promise<TaostatsSubnet[]> {
		const response = await this.client.get('/subnets');
		return response.data;
	}

	/**
	 * Get account info
	 */
	async getAccount(address: string): Promise<Record<string, unknown>> {
		const response = await this.client.get(`/account/${address}`);
		return response.data;
	}

	/**
	 * Get historical price data
	 */
	async getHistoricalPrice(days = 30): Promise<PricePoint[]> {
		const response = await this.client.get('/price/history', {
			params: { days },
		});
		return response.data;
	}

	/**
	 * Get historical emission data
	 */
	async getHistoricalEmission(days = 30): Promise<{ timestamp: number; emission: number }[]> {
		const response = await this.client.get('/emission/history', {
			params: { days },
		});
		return response.data;
	}

	/**
	 * Get network statistics
	 */
	async getNetworkStats(): Promise<{
		totalStake: string;
		totalSupply: string;
		circulatingSupply: string;
		blockHeight: number;
		validators: number;
		subnets: number;
	}> {
		const response = await this.client.get('/network/stats');
		return response.data;
	}

	/**
	 * Get transfer history for an address
	 */
	async getTransferHistory(
		address: string,
		limit = 50,
		offset = 0
	): Promise<{
		hash: string;
		from: string;
		to: string;
		amount: string;
		block: number;
		timestamp: number;
	}[]> {
		const response = await this.client.get(`/account/${address}/transfers`, {
			params: { limit, offset },
		});
		return response.data;
	}

	/**
	 * Get staking history for an address
	 */
	async getStakingHistory(
		address: string,
		limit = 50,
		offset = 0
	): Promise<{
		type: 'stake' | 'unstake';
		hotkey: string;
		amount: string;
		block: number;
		timestamp: number;
	}[]> {
		const response = await this.client.get(`/account/${address}/staking`, {
			params: { limit, offset },
		});
		return response.data;
	}

	/**
	 * Get validator delegations
	 */
	async getValidatorDelegations(hotkey: string): Promise<{
		coldkey: string;
		stake: string;
		percentage: number;
	}[]> {
		const response = await this.client.get(`/validator/${hotkey}/delegations`);
		return response.data;
	}

	/**
	 * Search for addresses or transactions
	 */
	async search(query: string): Promise<{
		type: 'address' | 'transaction' | 'block';
		result: unknown;
	}[]> {
		const response = await this.client.get('/search', {
			params: { q: query },
		});
		return response.data;
	}
}

/**
 * Create Taostats client
 */
export function createTaostatsClient(apiKey?: string): TaostatsApiClient {
	return new TaostatsApiClient(apiKey);
}
