/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BittensorNetwork implements ICredentialType {
	name = 'bittensorNetwork';
	displayName = 'Bittensor Network';
	documentationUrl = 'https://docs.bittensor.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Finney (Mainnet)',
					value: 'finney',
				},
				{
					name: 'Testnet',
					value: 'testnet',
				},
				{
					name: 'Local',
					value: 'local',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'finney',
			description: 'The Bittensor network to connect to',
		},
		{
			displayName: 'WebSocket Endpoint',
			name: 'wsEndpoint',
			type: 'string',
			default: '',
			placeholder: 'wss://entrypoint-finney.opentensor.ai:443',
			description: 'Custom WebSocket endpoint (required for custom network)',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
		},
		{
			displayName: 'Authentication Type',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'Read Only (No Keys)',
					value: 'readOnly',
				},
				{
					name: 'Coldkey Only',
					value: 'coldkey',
				},
				{
					name: 'Hotkey Only',
					value: 'hotkey',
				},
				{
					name: 'Both Keys',
					value: 'both',
				},
			],
			default: 'readOnly',
			description: 'Authentication type for transactions',
		},
		{
			displayName: 'Coldkey Mnemonic',
			name: 'coldkeyMnemonic',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The 12 or 24 word mnemonic for the coldkey (main wallet)',
			displayOptions: {
				show: {
					authType: ['coldkey', 'both'],
				},
			},
		},
		{
			displayName: 'Hotkey Mnemonic',
			name: 'hotkeyMnemonic',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The 12 or 24 word mnemonic for the hotkey (operational key)',
			displayOptions: {
				show: {
					authType: ['hotkey', 'both'],
				},
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};
}
