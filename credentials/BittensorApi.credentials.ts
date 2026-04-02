import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BittensorApi implements ICredentialType {
	name = 'bittensorApi';
	displayName = 'Bittensor API';
	documentationUrl = 'https://docs.bittensor.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for Bittensor. Register for an API key through the Bittensor dashboard.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.bittensor.com/v1',
			description: 'Base URL for Bittensor API',
		},
	];
}