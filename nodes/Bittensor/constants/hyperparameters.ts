/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Bittensor Hyperparameters
 */

export interface HyperparameterDefinition {
	name: string;
	description: string;
	type: 'u64' | 'u16' | 'bool' | 'float';
	default: number | boolean | bigint;
	min?: number;
	max?: number;
}

/**
 * Default Hyperparameters
 */
export const HYPERPARAMETER_DEFAULTS: Record<string, HyperparameterDefinition> = {
	rho: {
		name: 'Rho',
		description: 'Subnet inflation rate (10 = 1%)',
		type: 'u16',
		default: 10,
		min: 1,
		max: 100,
	},
	kappa: {
		name: 'Kappa',
		description: 'Consensus shift parameter (32767 = 0.5)',
		type: 'u16',
		default: 32767,
		min: 0,
		max: 65535,
	},
	difficulty: {
		name: 'Difficulty',
		description: 'POW registration difficulty',
		type: 'u64',
		default: 10_000_000,
		min: 1,
	},
	immunity_period: {
		name: 'Immunity Period',
		description: 'Blocks before neuron can be pruned after registration',
		type: 'u16',
		default: 4096,
		min: 0,
		max: 65535,
	},
	tempo: {
		name: 'Tempo',
		description: 'Blocks between weight setting epochs',
		type: 'u16',
		default: 360,
		min: 1,
		max: 65535,
	},
	min_allowed_weights: {
		name: 'Min Allowed Weights',
		description: 'Minimum number of weights a validator must set',
		type: 'u16',
		default: 1,
		min: 0,
		max: 65535,
	},
	max_weight_limit: {
		name: 'Max Weight Limit',
		description: 'Maximum weight value (65535 = 100%)',
		type: 'u16',
		default: 65535,
		min: 0,
		max: 65535,
	},
	max_difficulty: {
		name: 'Max Difficulty',
		description: 'Maximum POW difficulty',
		type: 'u64',
		default: 4_611_686_018_427_387_903n,
		min: 1,
	},
	weights_version_key: {
		name: 'Weights Version Key',
		description: 'Required version for weight setting',
		type: 'u64',
		default: 0,
		min: 0,
	},
	weights_rate_limit: {
		name: 'Weights Rate Limit',
		description: 'Minimum blocks between weight updates',
		type: 'u64',
		default: 100,
		min: 0,
	},
	adjustment_interval: {
		name: 'Adjustment Interval',
		description: 'Blocks between difficulty adjustments',
		type: 'u16',
		default: 112,
		min: 1,
	},
	activity_cutoff: {
		name: 'Activity Cutoff',
		description: 'Blocks of inactivity before pruning eligible',
		type: 'u16',
		default: 5000,
		min: 0,
	},
	registration_allowed: {
		name: 'Registration Allowed',
		description: 'Whether new registrations are permitted',
		type: 'bool',
		default: true,
	},
	max_validators: {
		name: 'Max Validators',
		description: 'Maximum number of validators in subnet',
		type: 'u16',
		default: 128,
		min: 1,
		max: 65535,
	},
};

/**
 * Emission Constants
 */
export const EMISSION_CONSTANTS = {
	TOTAL_SUPPLY: BigInt(21_000_000) * BigInt(1_000_000_000), // 21M TAO in RAO
	BLOCKS_PER_HALVING: 10_500_000,
	INITIAL_BLOCK_EMISSION: BigInt(1_000_000_000), // 1 TAO per block initially
};
