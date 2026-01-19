/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Bittensor Subnet Registry
 */

export interface SubnetInfo {
	netuid: number;
	name: string;
	description: string;
	category: string;
}

/**
 * Known Subnets
 */
export const KNOWN_SUBNETS: SubnetInfo[] = [
	{ netuid: 0, name: 'Root Network', description: 'Governance and emission allocation', category: 'governance' },
	{ netuid: 1, name: 'Text Prompting', description: 'Large language model inference', category: 'text' },
	{ netuid: 2, name: 'Machine Translation', description: 'Translation services', category: 'text' },
	{ netuid: 3, name: 'Data Scraping', description: 'Web data collection', category: 'data' },
	{ netuid: 4, name: 'Multi-Modality', description: 'Multi-modal AI', category: 'multimodal' },
	{ netuid: 5, name: 'Image Generation', description: 'AI image creation', category: 'image' },
	{ netuid: 8, name: 'Time Series', description: 'Time series prediction', category: 'prediction' },
	{ netuid: 9, name: 'Pretraining', description: 'Model pretraining', category: 'training' },
	{ netuid: 11, name: 'Text-to-Speech', description: 'Voice synthesis', category: 'audio' },
	{ netuid: 13, name: 'Data Universe', description: 'Data marketplace', category: 'data' },
	{ netuid: 18, name: 'Cortex.t', description: 'Advanced text processing', category: 'text' },
	{ netuid: 19, name: 'Vision', description: 'Computer vision', category: 'image' },
	{ netuid: 21, name: 'FileTAO', description: 'Decentralized storage', category: 'storage' },
];

/**
 * Hyperparameter Names
 */
export const HYPERPARAMETER_NAMES = [
	'rho', 'kappa', 'immunity_period', 'min_allowed_weights',
	'max_weight_limit', 'tempo', 'min_difficulty', 'max_difficulty',
	'weights_version_key', 'weights_rate_limit', 'adjustment_interval',
	'activity_cutoff', 'registration_allowed', 'target_regs_per_interval',
	'min_burn', 'max_burn', 'bonds_moving_avg', 'max_regs_per_block',
	'serving_rate_limit', 'max_validators', 'adjustment_alpha',
	'difficulty', 'commit_reveal_weights_interval', 'commit_reveal_weights_enabled',
	'alpha_high', 'alpha_low', 'liquid_alpha_enabled',
];

/**
 * Get subnet info by netuid
 */
export function getSubnetInfo(netuid: number): SubnetInfo | undefined {
	return KNOWN_SUBNETS.find(s => s.netuid === netuid);
}

/**
 * Get subnets by category
 */
export function getSubnetsByCategory(category: string): SubnetInfo[] {
	return KNOWN_SUBNETS.filter(s => s.category === category);
}
