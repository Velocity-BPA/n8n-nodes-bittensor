/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit Converter Utilities
 * 
 * Handles conversions between TAO and RAO units.
 * 1 TAO = 1,000,000,000 RAO (10^9)
 */

import { RAO_PER_TAO } from '../constants/networks';

/**
 * Convert RAO to TAO
 */
export function raoToTao(rao: bigint | string | number): number {
	const raoBigInt = typeof rao === 'bigint' ? rao : BigInt(rao.toString());
	return Number(raoBigInt) / Number(RAO_PER_TAO);
}

/**
 * Convert TAO to RAO
 */
export function taoToRao(tao: number | string): bigint {
	const taoNumber = typeof tao === 'string' ? parseFloat(tao) : tao;
	return BigInt(Math.floor(taoNumber * Number(RAO_PER_TAO)));
}

/**
 * Format TAO amount for display
 */
export function formatTao(rao: bigint | string | number, decimals = 4): string {
	const tao = raoToTao(rao);
	return `${tao.toFixed(decimals)} τ`;
}

/**
 * Format RAO amount for display
 */
export function formatRao(rao: bigint | string | number): string {
	const raoBigInt = typeof rao === 'bigint' ? rao : BigInt(rao.toString());
	return `${raoBigInt.toLocaleString()} RAO`;
}

/**
 * Parse amount string to RAO
 */
export function parseAmount(amount: string, unit: 'tao' | 'rao' = 'tao'): bigint {
	if (unit === 'rao') {
		return BigInt(amount.replace(/[^0-9]/g, ''));
	}
	return taoToRao(parseFloat(amount));
}

/**
 * Calculate stake percentage
 */
export function calculateStakePercentage(stake: bigint, totalStake: bigint): number {
	if (totalStake === BigInt(0)) return 0;
	return (Number(stake) / Number(totalStake)) * 100;
}

/**
 * Convert weight to percentage
 */
export function weightToPercentage(weight: number, maxWeight = 65535): number {
	return (weight / maxWeight) * 100;
}

/**
 * Convert percentage to weight
 */
export function percentageToWeight(percentage: number, maxWeight = 65535): number {
	return Math.floor((percentage / 100) * maxWeight);
}

/**
 * Convert take rate to percentage
 */
export function takeToPercentage(take: number): number {
	return (take / 65535) * 100;
}

/**
 * Calculate APY from emission rate
 */
export function calculateApy(
	dailyEmission: bigint,
	totalStake: bigint,
	daysPerYear = 365
): number {
	if (totalStake === BigInt(0)) return 0;
	const dailyRate = Number(dailyEmission) / Number(totalStake);
	return dailyRate * daysPerYear * 100;
}

/**
 * Balance output helper
 */
export function toBalanceOutput(rao: bigint): { rao: string; tao: number; formatted: string } {
	return {
		rao: rao.toString(),
		tao: raoToTao(rao),
		formatted: formatTao(rao),
	};
}
