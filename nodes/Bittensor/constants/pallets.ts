/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Bittensor Substrate Pallet Definitions
 */

/**
 * Pallet Names
 */
export const PALLETS = {
	SUBTENSOR_MODULE: 'subtensorModule',
	BALANCES: 'balances',
	SYSTEM: 'system',
	SENATE: 'senateMembers',
	TRIUMVIRATE: 'triumvirate',
} as const;

/**
 * Subtensor Storage Queries
 */
export const SUBTENSOR_STORAGE = {
	// Network
	TotalNetworks: 'totalNetworks',
	NetworksAdded: 'networksAdded',
	
	// Subnet
	SubnetOwner: 'subnetOwner',
	NetworkRegistrationAllowed: 'networkRegistrationAllowed',
	Tempo: 'tempo',
	Difficulty: 'difficulty',
	ImmunityPeriod: 'immunityPeriod',
	MaxAllowedValidators: 'maxAllowedValidators',
	MinAllowedWeights: 'minAllowedWeights',
	MaxWeightLimit: 'maxWeightLimit',
	SubnetworkN: 'subnetworkN',
	
	// Neurons
	Uids: 'uids',
	Keys: 'keys',
	Owner: 'owner',
	IsNetworkMember: 'isNetworkMember',
	
	// Stake
	TotalStake: 'totalStake',
	TotalColdkeyStake: 'totalColdkeyStake',
	TotalHotkeyStake: 'totalHotkeyStake',
	Stake: 'stake',
	
	// Neurons Data
	Active: 'active',
	Rank: 'rank',
	Trust: 'trust',
	Consensus: 'consensus',
	Incentive: 'incentive',
	Dividends: 'dividends',
	Emission: 'emission',
	ValidatorTrust: 'validatorTrust',
	ValidatorPermit: 'validatorPermit',
	
	// Weights
	Weights: 'weights',
	Bonds: 'bonds',
	
	// Delegation
	Delegates: 'delegates',
	
	// Axon
	Axons: 'axons',
	Prometheus: 'prometheus',
	
	// Emission
	PendingEmission: 'pendingEmission',
	BlockEmission: 'blockEmission',
	
	// Registration
	Burn: 'burn',
	POWRegistrationsThisInterval: 'pOWRegistrationsThisInterval',
	BurnRegistrationsThisInterval: 'burnRegistrationsThisInterval',
} as const;

/**
 * Subtensor Extrinsics
 */
export const SUBTENSOR_EXTRINSICS = {
	// Staking
	addStake: 'addStake',
	removeStake: 'removeStake',
	
	// Registration
	burnedRegister: 'burnedRegister',
	register: 'register',
	
	// Weights
	setWeights: 'setWeights',
	commitWeights: 'commitWeights',
	revealWeights: 'revealWeights',
	
	// Delegation
	becomeDelegate: 'becomeDelegate',
	
	// Root
	rootRegister: 'rootRegister',
	setRootWeights: 'setRootWeights',
	
	// Serving
	serveAxon: 'serveAxon',
	servePrometheus: 'servePrometheus',
} as const;
