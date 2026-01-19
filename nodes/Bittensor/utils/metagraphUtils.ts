/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Metagraph Utilities
 * 
 * Handles metagraph data structures and operations.
 */

import { raoToTao } from './unitConverter';

/**
 * Axon (miner endpoint) information
 */
export interface AxonInfo {
	ip: string;
	port: number;
	ipType: number;
	protocol: number;
	version: number;
	placeholder1: number;
	placeholder2: number;
}

/**
 * Prometheus endpoint information
 */
export interface PrometheusInfo {
	ip: string;
	port: number;
	version: number;
	ipType: number;
	block: number;
}

/**
 * Neuron information
 */
export interface NeuronInfo {
	uid: number;
	hotkey: string;
	coldkey: string;
	stake: bigint;
	stakeTao: number;
	rank: number;
	trust: number;
	consensus: number;
	incentive: number;
	dividends: number;
	emission: bigint;
	emissionTao: number;
	validatorTrust: number;
	validatorPermit: boolean;
	active: boolean;
	lastUpdate: number;
	axonInfo?: AxonInfo;
	prometheusInfo?: PrometheusInfo;
}

/**
 * Full metagraph structure
 */
export interface Metagraph {
	netuid: number;
	n: number;
	block: number;
	neurons: NeuronInfo[];
	weights?: number[][];
	bonds?: number[][];
}

/**
 * Parse raw neuron data from chain
 */
export function parseNeuronInfo(raw: Record<string, unknown>, uid: number): NeuronInfo {
	const stake = BigInt((raw.stake as string) || '0');
	const emission = BigInt((raw.emission as string) || '0');
	
	return {
		uid,
		hotkey: (raw.hotkey as string) || '',
		coldkey: (raw.coldkey as string) || '',
		stake,
		stakeTao: raoToTao(stake),
		rank: Number(raw.rank || 0) / 65535,
		trust: Number(raw.trust || 0) / 65535,
		consensus: Number(raw.consensus || 0) / 65535,
		incentive: Number(raw.incentive || 0) / 65535,
		dividends: Number(raw.dividends || 0) / 65535,
		emission,
		emissionTao: raoToTao(emission),
		validatorTrust: Number(raw.validatorTrust || 0) / 65535,
		validatorPermit: Boolean(raw.validatorPermit),
		active: Boolean(raw.active),
		lastUpdate: Number(raw.lastUpdate || 0),
	};
}

/**
 * Get validators from metagraph
 */
export function getValidators(metagraph: Metagraph): NeuronInfo[] {
	return metagraph.neurons.filter(n => n.validatorPermit);
}

/**
 * Get miners from metagraph
 */
export function getMiners(metagraph: Metagraph): NeuronInfo[] {
	return metagraph.neurons.filter(n => !n.validatorPermit && n.active);
}

/**
 * Get active neurons
 */
export function getActiveNeurons(metagraph: Metagraph): NeuronInfo[] {
	return metagraph.neurons.filter(n => n.active);
}

/**
 * Get neuron by UID
 */
export function getNeuronByUid(metagraph: Metagraph, uid: number): NeuronInfo | undefined {
	return metagraph.neurons.find(n => n.uid === uid);
}

/**
 * Get neuron by hotkey
 */
export function getNeuronByHotkey(metagraph: Metagraph, hotkey: string): NeuronInfo | undefined {
	return metagraph.neurons.find(n => n.hotkey === hotkey);
}

/**
 * Calculate subnet statistics
 */
export function calculateSubnetStats(metagraph: Metagraph): {
	totalStake: bigint;
	totalStakeTao: number;
	totalEmission: bigint;
	validatorCount: number;
	minerCount: number;
	activeCount: number;
} {
	const totalStake = metagraph.neurons.reduce((sum, n) => sum + n.stake, BigInt(0));
	const totalEmission = metagraph.neurons.reduce((sum, n) => sum + n.emission, BigInt(0));
	
	return {
		totalStake,
		totalStakeTao: raoToTao(totalStake),
		totalEmission,
		validatorCount: getValidators(metagraph).length,
		minerCount: getMiners(metagraph).length,
		activeCount: getActiveNeurons(metagraph).length,
	};
}

/**
 * Rank neurons by incentive
 */
export function rankByIncentive(neurons: NeuronInfo[]): NeuronInfo[] {
	return [...neurons].sort((a, b) => b.incentive - a.incentive);
}

/**
 * Rank neurons by emission
 */
export function rankByEmission(neurons: NeuronInfo[]): NeuronInfo[] {
	return [...neurons].sort((a, b) => Number(b.emission - a.emission));
}

/**
 * Rank neurons by stake
 */
export function rankByStake(neurons: NeuronInfo[]): NeuronInfo[] {
	return [...neurons].sort((a, b) => Number(b.stake - a.stake));
}
