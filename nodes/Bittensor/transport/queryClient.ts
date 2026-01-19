/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Query Client
 * 
 * Client for querying Bittensor subnet miners and validators.
 */

import axios, { AxiosInstance } from 'axios';
import { AxonInfo } from '../utils/metagraphUtils';

/**
 * Query request options
 */
export interface QueryOptions {
	timeout?: number;
	retries?: number;
	retryDelay?: number;
}

/**
 * Query response
 */
export interface QueryResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	latency?: number;
}

/**
 * Text generation request
 */
export interface TextGenerationRequest {
	prompt: string;
	maxTokens?: number;
	temperature?: number;
	topP?: number;
}

/**
 * Image generation request
 */
export interface ImageGenerationRequest {
	prompt: string;
	width?: number;
	height?: number;
	steps?: number;
}

/**
 * Query Client Class
 */
export class QueryClient {
	private client: AxiosInstance;
	private defaultOptions: QueryOptions;

	constructor(options: QueryOptions = {}) {
		this.defaultOptions = {
			timeout: options.timeout || 30000,
			retries: options.retries || 3,
			retryDelay: options.retryDelay || 1000,
		};

		this.client = axios.create({
			timeout: this.defaultOptions.timeout,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	/**
	 * Build axon URL
	 */
	private buildAxonUrl(axon: AxonInfo, path = ''): string {
		const protocol = axon.protocol === 4 ? 'https' : 'http';
		return `${protocol}://${axon.ip}:${axon.port}${path}`;
	}

	/**
	 * Query an axon endpoint
	 */
	async query<T = unknown>(
		axon: AxonInfo,
		path: string,
		data: unknown,
		options?: QueryOptions
	): Promise<QueryResponse<T>> {
		const opts = { ...this.defaultOptions, ...options };
		const url = this.buildAxonUrl(axon, path);
		const startTime = Date.now();

		let lastError: Error | null = null;

		for (let attempt = 0; attempt < (opts.retries || 1); attempt++) {
			try {
				const response = await this.client.post<T>(url, data, {
					timeout: opts.timeout,
				});

				return {
					success: true,
					data: response.data,
					latency: Date.now() - startTime,
				};
			} catch (error) {
				lastError = error as Error;
				if (attempt < (opts.retries || 1) - 1) {
					await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
				}
			}
		}

		return {
			success: false,
			error: lastError?.message || 'Unknown error',
			latency: Date.now() - startTime,
		};
	}

	/**
	 * Text generation query
	 */
	async generateText(
		axon: AxonInfo,
		request: TextGenerationRequest,
		options?: QueryOptions
	): Promise<QueryResponse<{ text: string }>> {
		return this.query(axon, '/generate', request, options);
	}

	/**
	 * Image generation query
	 */
	async generateImage(
		axon: AxonInfo,
		request: ImageGenerationRequest,
		options?: QueryOptions
	): Promise<QueryResponse<{ image: string }>> {
		return this.query(axon, '/generate-image', request, options);
	}

	/**
	 * Embedding generation query
	 */
	async generateEmbeddings(
		axon: AxonInfo,
		texts: string[],
		options?: QueryOptions
	): Promise<QueryResponse<{ embeddings: number[][] }>> {
		return this.query(axon, '/embeddings', { texts }, options);
	}

	/**
	 * Health check
	 */
	async healthCheck(axon: AxonInfo): Promise<boolean> {
		try {
			const url = this.buildAxonUrl(axon, '/health');
			const response = await this.client.get(url, { timeout: 5000 });
			return response.status === 200;
		} catch {
			return false;
		}
	}

	/**
	 * Get axon info
	 */
	async getAxonInfo(axon: AxonInfo): Promise<QueryResponse<Record<string, unknown>>> {
		return this.query(axon, '/info', {});
	}

	/**
	 * Batch query multiple axons
	 */
	async batchQuery<T = unknown>(
		axons: AxonInfo[],
		path: string,
		data: unknown,
		options?: QueryOptions
	): Promise<QueryResponse<T>[]> {
		const promises = axons.map(axon => this.query<T>(axon, path, data, options));
		return Promise.all(promises);
	}

	/**
	 * Query with consensus (multiple miners)
	 */
	async consensusQuery<T = unknown>(
		axons: AxonInfo[],
		path: string,
		data: unknown,
		minResponses = 1,
		options?: QueryOptions
	): Promise<{ responses: QueryResponse<T>[]; consensus: T | null }> {
		const responses = await this.batchQuery<T>(axons, path, data, options);
		const successful = responses.filter(r => r.success && r.data);

		if (successful.length < minResponses) {
			return { responses, consensus: null };
		}

		// Simple consensus: return first successful response
		// More sophisticated consensus would compare responses
		return {
			responses,
			consensus: successful[0].data || null,
		};
	}
}

/**
 * Create query client
 */
export function createQueryClient(options?: QueryOptions): QueryClient {
	return new QueryClient(options);
}
