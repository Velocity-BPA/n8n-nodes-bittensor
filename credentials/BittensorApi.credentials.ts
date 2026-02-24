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
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for authenticating with Bittensor API',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.bittensor.com/v1',
			required: true,
			description: 'The base URL for the Bittensor API',
		},
	];
}