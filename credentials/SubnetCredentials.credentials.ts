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

export class SubnetCredentials implements ICredentialType {
	name = 'subnetCredentials';
	displayName = 'Bittensor Subnet';
	documentationUrl = 'https://docs.bittensor.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Subnet',
			name: 'subnet',
			type: 'options',
			options: [
				{ name: 'SN1 - Text Prompting', value: '1' },
				{ name: 'SN2 - Machine Translation', value: '2' },
				{ name: 'SN3 - Data Scraping', value: '3' },
				{ name: 'SN4 - Multi-Modality', value: '4' },
				{ name: 'SN5 - Image Generation', value: '5' },
				{ name: 'SN8 - Time Series Prediction', value: '8' },
				{ name: 'SN9 - Pretraining', value: '9' },
				{ name: 'SN11 - Text-to-Speech', value: '11' },
				{ name: 'SN13 - Data Universe', value: '13' },
				{ name: 'SN18 - Cortex.t', value: '18' },
				{ name: 'SN19 - Vision', value: '19' },
				{ name: 'SN21 - FileTAO', value: '21' },
				{ name: 'Custom', value: 'custom' },
			],
			default: '1',
			description: 'The subnet to interact with',
		},
		{
			displayName: 'Custom Subnet UID',
			name: 'customNetuid',
			type: 'number',
			default: 1,
			description: 'Custom subnet UID (netuid)',
			displayOptions: {
				show: {
					subnet: ['custom'],
				},
			},
		},
		{
			displayName: 'Validator Endpoint',
			name: 'validatorEndpoint',
			type: 'string',
			default: '',
			placeholder: 'http://validator.example.com:8080',
			description: 'Optional validator endpoint for queries',
		},
		{
			displayName: 'Miner Endpoint',
			name: 'minerEndpoint',
			type: 'string',
			default: '',
			placeholder: 'http://miner.example.com:8091',
			description: 'Optional direct miner endpoint',
		},
		{
			displayName: 'Query Timeout (Seconds)',
			name: 'queryTimeout',
			type: 'number',
			default: 30,
			description: 'Timeout for subnet queries',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};
}
