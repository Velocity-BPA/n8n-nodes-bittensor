/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Address Utilities
 * 
 * Handles Bittensor address encoding, validation, and derivation.
 * Bittensor uses SS58 encoding with prefix 42.
 */

import { encodeAddress, decodeAddress, checkAddress } from '@polkadot/util-crypto';
import { SS58_PREFIX } from '../constants/networks';

/**
 * Validate Bittensor address
 */
export function isValidBittensorAddress(address: string): boolean {
	try {
		const result = checkAddress(address, SS58_PREFIX);
		return result[0];
	} catch {
		return false;
	}
}

/**
 * Format address with optional truncation
 */
export function formatAddress(address: string, truncate = false): string {
	if (!isValidBittensorAddress(address)) {
		return address;
	}
	if (truncate) {
		return `${address.slice(0, 8)}...${address.slice(-8)}`;
	}
	return address;
}

/**
 * Encode public key to SS58 address
 */
export function encodeToSS58(publicKey: Uint8Array | string): string {
	return encodeAddress(publicKey, SS58_PREFIX);
}

/**
 * Decode SS58 address to public key
 */
export function decodeFromSS58(address: string): Uint8Array {
	return decodeAddress(address);
}

/**
 * Get address info
 */
export function getAddressInfo(address: string): {
	valid: boolean;
	formatted: string;
	truncated: string;
	publicKey?: string;
} {
	const valid = isValidBittensorAddress(address);
	return {
		valid,
		formatted: formatAddress(address),
		truncated: formatAddress(address, true),
		publicKey: valid ? Buffer.from(decodeFromSS58(address)).toString('hex') : undefined,
	};
}
