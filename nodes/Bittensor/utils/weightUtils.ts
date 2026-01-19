/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Weight Utilities
 * 
 * Handles weight calculations and validation for validators.
 */

/**
 * Weight entry
 */
export interface WeightEntry {
	uid: number;
	weight: number;
}

/**
 * Normalize weights to sum to max weight
 */
export function normalizeWeights(weights: WeightEntry[], maxWeight = 65535): WeightEntry[] {
	const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
	if (totalWeight === 0) return weights;
	
	return weights.map(w => ({
		uid: w.uid,
		weight: Math.floor((w.weight / totalWeight) * maxWeight),
	}));
}

/**
 * Convert percentages to weights
 */
export function percentagesToWeights(
	percentages: { uid: number; percentage: number }[],
	maxWeight = 65535
): WeightEntry[] {
	return percentages.map(p => ({
		uid: p.uid,
		weight: Math.floor((p.percentage / 100) * maxWeight),
	}));
}

/**
 * Validate weights
 */
export function validateWeights(
	weights: WeightEntry[],
	minAllowedWeights: number,
	maxWeightLimit: number
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	if (weights.length < minAllowedWeights) {
		errors.push(`Minimum ${minAllowedWeights} weights required, got ${weights.length}`);
	}
	
	const overLimit = weights.filter(w => w.weight > maxWeightLimit);
	if (overLimit.length > 0) {
		errors.push(`${overLimit.length} weights exceed max limit of ${maxWeightLimit}`);
	}
	
	const negativeWeights = weights.filter(w => w.weight < 0);
	if (negativeWeights.length > 0) {
		errors.push('Negative weights are not allowed');
	}
	
	const duplicateUids = weights.filter((w, i, arr) => 
		arr.findIndex(x => x.uid === w.uid) !== i
	);
	if (duplicateUids.length > 0) {
		errors.push('Duplicate UIDs found');
	}
	
	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Sort weights by UID
 */
export function sortWeightsByUid(weights: WeightEntry[]): WeightEntry[] {
	return [...weights].sort((a, b) => a.uid - b.uid);
}

/**
 * Filter zero weights
 */
export function filterZeroWeights(weights: WeightEntry[]): WeightEntry[] {
	return weights.filter(w => w.weight > 0);
}

/**
 * Get top weights by value
 */
export function getTopWeights(weights: WeightEntry[], n: number): WeightEntry[] {
	return [...weights].sort((a, b) => b.weight - a.weight).slice(0, n);
}

/**
 * Prepare weights for submission
 */
export function prepareWeightsForSubmission(
	weights: WeightEntry[]
): { uids: number[]; values: number[] } {
	const sorted = sortWeightsByUid(filterZeroWeights(weights));
	return {
		uids: sorted.map(w => w.uid),
		values: sorted.map(w => w.weight),
	};
}
