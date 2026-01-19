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

export class BittensorApi implements ICredentialType {
	name = 'bittensorApi';
	displayName = 'Bittensor API';
	documentationUrl = 'https://taostats.io/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Provider',
			name: 'provider',
			type: 'options',
			options: [
				{
					name: 'Taostats',
					value: 'taostats',
				},
				{
					name: 'Bittensor Explorer',
					value: 'explorer',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'taostats',
			description: 'The API provider to use',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for the selected provider (if required)',
		},
		{
			displayName: 'Custom API URL',
			name: 'customUrl',
			type: 'string',
			default: '',
			placeholder: 'https://api.example.com',
			description: 'Custom API endpoint URL',
			displayOptions: {
				show: {
					provider: ['custom'],
				},
			},
		},
		{
			displayName: 'Rate Limit (Requests/Second)',
			name: 'rateLimit',
			type: 'number',
			default: 5,
			description: 'Maximum requests per second to avoid rate limiting',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};
}
