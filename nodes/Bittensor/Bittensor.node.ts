/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { createSubtensorClient } from './transport/subtensorClient';
import { createMetagraphSync } from './transport/metagraphSync';
import { createTaostatsClient } from './transport/taostatsApi';
import { NetworkType } from './constants/networks';
import { raoToTao, taoToRao, formatTao, toBalanceOutput } from './utils/unitConverter';
import { getAddressInfo } from './utils/addressUtils';
import { validateWeights } from './utils/weightUtils';
import { getSubnetInfo as getKnownSubnetInfo } from './constants/subnets';

// Emit licensing notice once on load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

// Log licensing notice once
let licenseNoticeLogged = false;
function logLicenseNotice(): void {
	if (!licenseNoticeLogged) {
		console.warn(LICENSING_NOTICE);
		licenseNoticeLogged = true;
	}
}

export class Bittensor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bittensor',
		name: 'bittensor',
		icon: 'file:bittensor.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Bittensor blockchain - TAO staking, delegation, subnet queries, and AI network operations',
		defaults: {
			name: 'Bittensor',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bittensorNetwork',
				required: true,
			},
			{
				name: 'bittensorApi',
				required: false,
			},
			{
				name: 'subnetCredentials',
				required: false,
			},
		],
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Wallet', value: 'wallet' },
					{ name: 'Staking', value: 'staking' },
					{ name: 'Delegation', value: 'delegation' },
					{ name: 'Subnet', value: 'subnet' },
					{ name: 'Neuron', value: 'neuron' },
					{ name: 'Registration', value: 'registration' },
					{ name: 'Validator', value: 'validator' },
					{ name: 'Miner', value: 'miner' },
					{ name: 'Metagraph', value: 'metagraph' },
					{ name: 'Weights', value: 'weights' },
					{ name: 'Query', value: 'query' },
					{ name: 'Root', value: 'root' },
					{ name: 'Governance', value: 'governance' },
					{ name: 'Block', value: 'block' },
					{ name: 'Emission', value: 'emission' },
					{ name: 'Utility', value: 'utility' },
				],
				default: 'wallet',
			},

			// ========== WALLET OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['wallet'] } },
				options: [
					{ name: 'Get Balance', value: 'getBalance', description: 'Get TAO balance for an address' },
					{ name: 'Get Stake', value: 'getStake', description: 'Get stake for coldkey-hotkey pair' },
					{ name: 'Get Overview', value: 'getOverview', description: 'Get wallet overview with balance and stakes' },
					{ name: 'Transfer', value: 'transfer', description: 'Transfer TAO to another address' },
					{ name: 'Validate Address', value: 'validateAddress', description: 'Validate a Bittensor address' },
					{ name: 'Get Transfer History', value: 'getTransferHistory', description: 'Get transfer history for address' },
				],
				default: 'getBalance',
			},

			// ========== STAKING OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['staking'] } },
				options: [
					{ name: 'Get Stake Info', value: 'getStakeInfo', description: 'Get detailed stake information' },
					{ name: 'Add Stake', value: 'addStake', description: 'Delegate stake to a hotkey' },
					{ name: 'Remove Stake', value: 'removeStake', description: 'Undelegate stake from a hotkey' },
					{ name: 'Get Stakes by Coldkey', value: 'getStakesByColdkey', description: 'Get all stakes for a coldkey' },
					{ name: 'Calculate APY', value: 'calculateApy', description: 'Calculate estimated APY for staking' },
				],
				default: 'getStakeInfo',
			},

			// ========== DELEGATION OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['delegation'] } },
				options: [
					{ name: 'Get Delegates', value: 'getDelegates', description: 'Get all delegates' },
					{ name: 'Get Delegate Info', value: 'getDelegateInfo', description: 'Get info for a specific delegate' },
					{ name: 'Get Take Rate', value: 'getTakeRate', description: 'Get delegate commission rate' },
					{ name: 'Get Top Delegates', value: 'getTopDelegates', description: 'Get top delegates by stake' },
					{ name: 'Get Delegators', value: 'getDelegators', description: 'Get delegators for a delegate' },
				],
				default: 'getDelegates',
			},

			// ========== SUBNET OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['subnet'] } },
				options: [
					{ name: 'Get All Subnets', value: 'getAllSubnets', description: 'Get list of all subnets' },
					{ name: 'Get Subnet Info', value: 'getSubnetInfo', description: 'Get detailed subnet information' },
					{ name: 'Get Hyperparameters', value: 'getHyperparameters', description: 'Get subnet hyperparameters' },
					{ name: 'Get Subnet Neurons', value: 'getSubnetNeurons', description: 'Get neurons in a subnet' },
					{ name: 'Get Registration Cost', value: 'getRegistrationCost', description: 'Get cost to register on subnet' },
				],
				default: 'getSubnetInfo',
			},

			// ========== NEURON OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['neuron'] } },
				options: [
					{ name: 'Get Neuron by UID', value: 'getNeuronByUid', description: 'Get neuron info by UID' },
					{ name: 'Get Neuron by Hotkey', value: 'getNeuronByHotkey', description: 'Get neuron info by hotkey' },
					{ name: 'Get Active Neurons', value: 'getActiveNeurons', description: 'Get all active neurons' },
				],
				default: 'getNeuronByUid',
			},

			// ========== REGISTRATION OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['registration'] } },
				options: [
					{ name: 'Get Registration Cost', value: 'getRegistrationCost', description: 'Get burn cost for registration' },
					{ name: 'Check Registration Status', value: 'checkRegistrationStatus', description: 'Check if hotkey is registered' },
					{ name: 'Burned Register', value: 'burnedRegister', description: 'Register on subnet by burning TAO' },
				],
				default: 'getRegistrationCost',
			},

			// ========== METAGRAPH OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['metagraph'] } },
				options: [
					{ name: 'Get Full Metagraph', value: 'getFullMetagraph', description: 'Get complete metagraph data' },
					{ name: 'Get Metagraph Lite', value: 'getMetagraphLite', description: 'Get lightweight metagraph' },
					{ name: 'Get UIDs', value: 'getUids', description: 'Get all UIDs in subnet' },
					{ name: 'Get Hotkeys', value: 'getHotkeys', description: 'Get all hotkeys in subnet' },
				],
				default: 'getFullMetagraph',
			},

			// ========== WEIGHTS OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['weights'] } },
				options: [
					{ name: 'Get Weights', value: 'getWeights', description: 'Get weights set by a validator' },
					{ name: 'Set Weights', value: 'setWeights', description: 'Set weights as a validator' },
					{ name: 'Validate Weights', value: 'validateWeights', description: 'Validate weight values' },
				],
				default: 'getWeights',
			},

			// ========== QUERY OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['query'] } },
				options: [
					{ name: 'Text Generation', value: 'textGeneration', description: 'Generate text using subnet' },
					{ name: 'Image Generation', value: 'imageGeneration', description: 'Generate image using subnet' },
				],
				default: 'textGeneration',
			},

			// ========== BLOCK OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['block'] } },
				options: [
					{ name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get current block number' },
					{ name: 'Get Block', value: 'getBlock', description: 'Get block by number' },
					{ name: 'Get Block Hash', value: 'getBlockHash', description: 'Get hash for a block' },
				],
				default: 'getLatestBlock',
			},

			// ========== EMISSION OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['emission'] } },
				options: [
					{ name: 'Get Total Supply', value: 'getTotalSupply', description: 'Get total TAO supply info' },
					{ name: 'Get Subnet Emission', value: 'getSubnetEmission', description: 'Get emission for a subnet' },
				],
				default: 'getTotalSupply',
			},

			// ========== UTILITY OPERATIONS ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['utility'] } },
				options: [
					{ name: 'RAO to TAO', value: 'raoToTao', description: 'Convert RAO to TAO' },
					{ name: 'TAO to RAO', value: 'taoToRao', description: 'Convert TAO to RAO' },
					{ name: 'Validate Address', value: 'validateAddress', description: 'Validate Bittensor address' },
					{ name: 'Generate Mnemonic', value: 'generateMnemonic', description: 'Generate new mnemonic phrase' },
				],
				default: 'raoToTao',
			},

			// ========== COMMON PARAMETERS ==========
			// Address parameter
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				required: true,
				description: 'Bittensor address (SS58 format)',
				displayOptions: {
					show: {
						resource: ['wallet'],
						operation: ['getBalance', 'getOverview', 'validateAddress', 'getTransferHistory'],
					},
				},
			},
			// Coldkey parameter
			{
				displayName: 'Coldkey',
				name: 'coldkey',
				type: 'string',
				default: '',
				required: true,
				description: 'Coldkey address',
				displayOptions: {
					show: {
						resource: ['wallet', 'staking'],
						operation: ['getStake', 'getStakeInfo', 'getStakesByColdkey'],
					},
				},
			},
			// Hotkey parameter
			{
				displayName: 'Hotkey',
				name: 'hotkey',
				type: 'string',
				default: '',
				required: true,
				description: 'Hotkey address',
				displayOptions: {
					show: {
						resource: ['wallet', 'staking', 'delegation', 'neuron'],
						operation: ['getStake', 'getStakeInfo', 'addStake', 'removeStake', 'getDelegateInfo', 'getTakeRate', 'getDelegators', 'getNeuronByHotkey'],
					},
				},
			},
			// Netuid parameter
			{
				displayName: 'Subnet UID',
				name: 'netuid',
				type: 'number',
				default: 1,
				required: true,
				description: 'Subnet network UID',
				displayOptions: {
					show: {
						resource: ['subnet', 'neuron', 'registration', 'metagraph', 'weights', 'emission'],
						operation: ['getSubnetInfo', 'getHyperparameters', 'getSubnetNeurons', 'getRegistrationCost', 'getNeuronByUid', 'getActiveNeurons', 'checkRegistrationStatus', 'burnedRegister', 'getFullMetagraph', 'getMetagraphLite', 'getUids', 'getHotkeys', 'getWeights', 'setWeights', 'getSubnetEmission'],
					},
				},
			},
			// UID parameter
			{
				displayName: 'UID',
				name: 'uid',
				type: 'number',
				default: 0,
				required: true,
				description: 'Neuron UID',
				displayOptions: {
					show: {
						resource: ['neuron', 'weights'],
						operation: ['getNeuronByUid', 'getWeights'],
					},
				},
			},
			// Amount parameter
			{
				displayName: 'Amount (TAO)',
				name: 'amount',
				type: 'number',
				default: 0,
				required: true,
				description: 'Amount in TAO',
				displayOptions: {
					show: {
						resource: ['wallet', 'staking', 'utility'],
						operation: ['transfer', 'addStake', 'removeStake', 'taoToRao'],
					},
				},
			},
			// RAO amount parameter
			{
				displayName: 'Amount (RAO)',
				name: 'amountRao',
				type: 'string',
				default: '0',
				required: true,
				description: 'Amount in RAO',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['raoToTao'],
					},
				},
			},
			// Recipient address parameter
			{
				displayName: 'Recipient Address',
				name: 'recipient',
				type: 'string',
				default: '',
				required: true,
				description: 'Recipient Bittensor address',
				displayOptions: {
					show: {
						resource: ['wallet'],
						operation: ['transfer'],
					},
				},
			},
			// Block number parameter
			{
				displayName: 'Block Number',
				name: 'blockNumber',
				type: 'number',
				default: 0,
				required: true,
				description: 'Block number',
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['getBlock', 'getBlockHash'],
					},
				},
			},
			// Prompt parameter for queries
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				required: true,
				typeOptions: {
					rows: 4,
				},
				description: 'Text prompt for generation',
				displayOptions: {
					show: {
						resource: ['query'],
						operation: ['textGeneration', 'imageGeneration'],
					},
				},
			},
			// Weights parameter for setWeights
			{
				displayName: 'Weights',
				name: 'weights',
				type: 'json',
				default: '[]',
				required: true,
				description: 'Array of {uid, weight} objects',
				displayOptions: {
					show: {
						resource: ['weights'],
						operation: ['setWeights', 'validateWeights'],
					},
				},
			},
			// Limit parameter
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of results',
				displayOptions: {
					show: {
						resource: ['wallet', 'delegation'],
						operation: ['getTransferHistory', 'getTopDelegates', 'getDelegators'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice on first execution
		logLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('bittensorNetwork');
		
		const network = credentials.network as NetworkType | 'custom';
		const wsEndpoint = credentials.wsEndpoint as string | undefined;
		const coldkeyMnemonic = credentials.coldkeyMnemonic as string | undefined;
		const hotkeyMnemonic = credentials.hotkeyMnemonic as string | undefined;

		const client = await createSubtensorClient({
			network,
			wsEndpoint,
			coldkeyMnemonic,
			hotkeyMnemonic,
		});

		if (coldkeyMnemonic) {
			client.initColdkey(coldkeyMnemonic);
		}
		if (hotkeyMnemonic) {
			client.initHotkey(hotkeyMnemonic);
		}

		try {
			for (let i = 0; i < items.length; i++) {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let result: Record<string, unknown> = {};

				// ============ WALLET OPERATIONS ============
				if (resource === 'wallet') {
					if (operation === 'getBalance') {
						const address = this.getNodeParameter('address', i) as string;
						const balance = await client.getBalance(address);
						result = {
							address,
							...toBalanceOutput(balance),
						};
					} else if (operation === 'getStake') {
						const coldkey = this.getNodeParameter('coldkey', i) as string;
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						const stake = await client.getStake(coldkey, hotkey);
						result = {
							coldkey,
							hotkey,
							...toBalanceOutput(stake),
						};
					} else if (operation === 'getOverview') {
						const address = this.getNodeParameter('address', i) as string;
						const balance = await client.getBalance(address);
						const totalStake = await client.getTotalColdkeyStake(address);
						result = {
							address,
							balance: toBalanceOutput(balance),
							totalStake: toBalanceOutput(totalStake),
							total: toBalanceOutput(balance + totalStake),
						};
					} else if (operation === 'transfer') {
						const recipient = this.getNodeParameter('recipient', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const txResult = await client.transfer(recipient, amount);
						result = {
							recipient,
							amount,
							amountFormatted: formatTao(taoToRao(amount)),
							...txResult,
						};
					} else if (operation === 'validateAddress') {
						const address = this.getNodeParameter('address', i) as string;
						result = getAddressInfo(address);
					} else if (operation === 'getTransferHistory') {
						const address = this.getNodeParameter('address', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						try {
							const apiCredentials = await this.getCredentials('bittensorApi');
							const taostats = createTaostatsClient(apiCredentials?.apiKey as string);
							const history = await taostats.getTransferHistory(address, limit);
							result = { address, transfers: history };
						} catch {
							result = { address, transfers: [], message: 'API credentials required for transfer history' };
						}
					}
				}

				// ============ STAKING OPERATIONS ============
				else if (resource === 'staking') {
					if (operation === 'getStakeInfo') {
						const coldkey = this.getNodeParameter('coldkey', i) as string;
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						const stake = await client.getStake(coldkey, hotkey);
						const totalHotkeyStake = await client.getTotalHotkeyStake(hotkey);
						result = {
							coldkey,
							hotkey,
							stake: toBalanceOutput(stake),
							totalHotkeyStake: toBalanceOutput(totalHotkeyStake),
						};
					} else if (operation === 'addStake') {
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const txResult = await client.addStake(hotkey, amount);
						result = { hotkey, amount, ...txResult };
					} else if (operation === 'removeStake') {
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const txResult = await client.removeStake(hotkey, amount);
						result = { hotkey, amount, ...txResult };
					} else if (operation === 'getStakesByColdkey') {
						const coldkey = this.getNodeParameter('coldkey', i) as string;
						const totalStake = await client.getTotalColdkeyStake(coldkey);
						result = {
							coldkey,
							totalStake: toBalanceOutput(totalStake),
						};
					} else if (operation === 'calculateApy') {
						result = {
							message: 'APY calculation requires historical data from Taostats API',
							estimatedApy: '~15-25% (varies by validator)',
						};
					}
				}

				// ============ DELEGATION OPERATIONS ============
				else if (resource === 'delegation') {
					if (operation === 'getDelegates') {
						const delegates = await client.getDelegates();
						result = { delegates, count: delegates.length };
					} else if (operation === 'getDelegateInfo') {
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						const take = await client.getDelegateTake(hotkey);
						const totalStake = await client.getTotalHotkeyStake(hotkey);
						result = {
							hotkey,
							take,
							takePercentage: (take / 65535) * 100,
							totalStake: toBalanceOutput(totalStake),
						};
					} else if (operation === 'getTakeRate') {
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						const take = await client.getDelegateTake(hotkey);
						result = {
							hotkey,
							take,
							takePercentage: (take / 65535) * 100,
						};
					} else if (operation === 'getTopDelegates') {
						try {
							const apiCredentials = await this.getCredentials('bittensorApi');
							const taostats = createTaostatsClient(apiCredentials?.apiKey as string);
							const limit = this.getNodeParameter('limit', i) as number;
							const validators = await taostats.getValidators(limit);
							result = { delegates: validators };
						} catch {
							result = { message: 'API credentials required for top delegates' };
						}
					} else if (operation === 'getDelegators') {
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						try {
							const apiCredentials = await this.getCredentials('bittensorApi');
							const taostats = createTaostatsClient(apiCredentials?.apiKey as string);
							const delegators = await taostats.getValidatorDelegations(hotkey);
							result = { hotkey, delegators };
						} catch {
							result = { hotkey, message: 'API credentials required for delegator list' };
						}
					}
				}

				// ============ SUBNET OPERATIONS ============
				else if (resource === 'subnet') {
					if (operation === 'getAllSubnets') {
						const totalNetworks = await client.getTotalNetworks();
						const subnets = [];
						for (let netuid = 0; netuid < totalNetworks; netuid++) {
							const known = getKnownSubnetInfo(netuid);
							subnets.push({
								netuid,
								name: known?.name || `Subnet ${netuid}`,
								description: known?.description || 'Unknown subnet',
							});
						}
						result = { subnets, count: totalNetworks };
					} else if (operation === 'getSubnetInfo') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const info = await client.getSubnetInfo(netuid);
						const known = getKnownSubnetInfo(netuid);
						result = {
							...info,
							name: known?.name || `Subnet ${netuid}`,
							description: known?.description || 'Unknown subnet',
						};
					} else if (operation === 'getHyperparameters') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const info = await client.getSubnetInfo(netuid);
						result = {
							netuid,
							tempo: info.tempo,
							difficulty: info.difficulty,
							immunityPeriod: info.immunityPeriod,
							maxValidators: info.maxValidators,
							minAllowedWeights: info.minAllowedWeights,
							maxWeightLimit: info.maxWeightLimit,
						};
					} else if (operation === 'getSubnetNeurons') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const metagraphSync = createMetagraphSync(client);
						const metagraph = await metagraphSync.sync({ netuid, lite: true });
						result = {
							netuid,
							neurons: metagraph.neurons.map(n => ({
								uid: n.uid,
								hotkey: n.hotkey,
								stake: n.stakeTao,
								active: n.active,
							})),
							count: metagraph.n,
						};
					} else if (operation === 'getRegistrationCost') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const cost = await client.getRegistrationCost(netuid);
						result = {
							netuid,
							...toBalanceOutput(cost),
						};
					}
				}

				// ============ NEURON OPERATIONS ============
				else if (resource === 'neuron') {
					if (operation === 'getNeuronByUid') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const uid = this.getNodeParameter('uid', i) as number;
						const neuron = await client.getNeuronInfo(netuid, uid);
						result = {
							...neuron,
							stakeTao: raoToTao(BigInt(neuron.stake as string)),
						};
					} else if (operation === 'getNeuronByHotkey') {
						const hotkey = this.getNodeParameter('hotkey', i) as string;
						result = {
							hotkey,
							message: 'Use metagraph sync to find neuron by hotkey',
						};
					} else if (operation === 'getActiveNeurons') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const metagraphSync = createMetagraphSync(client);
						const metagraph = await metagraphSync.sync({ netuid });
						const active = metagraph.neurons.filter(n => n.active);
						result = {
							netuid,
							activeNeurons: active.length,
							totalNeurons: metagraph.n,
							neurons: active.slice(0, 50),
						};
					}
				}

				// ============ REGISTRATION OPERATIONS ============
				else if (resource === 'registration') {
					if (operation === 'getRegistrationCost') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const cost = await client.getRegistrationCost(netuid);
						result = {
							netuid,
							burnCost: toBalanceOutput(cost),
						};
					} else if (operation === 'checkRegistrationStatus') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						result = {
							netuid,
							message: 'Check registration status via metagraph',
						};
					} else if (operation === 'burnedRegister') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const txResult = await client.burnedRegister(netuid);
						result = { netuid, ...txResult };
					}
				}

				// ============ METAGRAPH OPERATIONS ============
				else if (resource === 'metagraph') {
					const netuid = this.getNodeParameter('netuid', i) as number;
					const metagraphSync = createMetagraphSync(client);
					
					if (operation === 'getFullMetagraph') {
						const metagraph = await metagraphSync.sync({ netuid });
						result = {
							netuid,
							n: metagraph.n,
							block: metagraph.block,
							neurons: metagraph.neurons,
						};
					} else if (operation === 'getMetagraphLite') {
						const lite = await metagraphSync.syncLite(netuid);
						result = { netuid, ...lite };
					} else if (operation === 'getUids') {
						const lite = await metagraphSync.syncLite(netuid);
						result = { netuid, uids: lite.uids };
					} else if (operation === 'getHotkeys') {
						const lite = await metagraphSync.syncLite(netuid);
						result = { netuid, hotkeys: lite.hotkeys };
					}
				}

				// ============ WEIGHTS OPERATIONS ============
				else if (resource === 'weights') {
					if (operation === 'getWeights') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const uid = this.getNodeParameter('uid', i) as number;
						result = {
							netuid,
							uid,
							message: 'Weights query requires metagraph sync',
						};
					} else if (operation === 'setWeights') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						const weightsJson = this.getNodeParameter('weights', i) as string;
						const weights = JSON.parse(weightsJson);
						const uids = weights.map((w: { uid: number }) => w.uid);
						const values = weights.map((w: { weight: number }) => w.weight);
						const txResult = await client.setWeights(netuid, uids, values, 0);
						result = { netuid, weights, ...txResult };
					} else if (operation === 'validateWeights') {
						const weightsJson = this.getNodeParameter('weights', i) as string;
						const weights = JSON.parse(weightsJson);
						const validation = validateWeights(weights, 1, 65535);
						result = validation;
					}
				}

				// ============ QUERY OPERATIONS ============
				else if (resource === 'query') {
					if (operation === 'textGeneration') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						result = {
							message: 'Text generation requires a miner axon endpoint',
							prompt,
						};
					} else if (operation === 'imageGeneration') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						result = {
							message: 'Image generation requires a miner axon endpoint',
							prompt,
						};
					}
				}

				// ============ BLOCK OPERATIONS ============
				else if (resource === 'block') {
					if (operation === 'getLatestBlock') {
						const blockNumber = await client.getBlockNumber();
						result = { blockNumber };
					} else if (operation === 'getBlock') {
						const blockNumber = this.getNodeParameter('blockNumber', i) as number;
						const hash = await client.getBlockHash(blockNumber);
						result = { blockNumber, hash };
					} else if (operation === 'getBlockHash') {
						const blockNumber = this.getNodeParameter('blockNumber', i) as number;
						const hash = await client.getBlockHash(blockNumber);
						result = { blockNumber, hash };
					}
				}

				// ============ EMISSION OPERATIONS ============
				else if (resource === 'emission') {
					if (operation === 'getTotalSupply') {
						try {
							const apiCredentials = await this.getCredentials('bittensorApi');
							const taostats = createTaostatsClient(apiCredentials?.apiKey as string);
							const stats = await taostats.getNetworkStats();
							result = stats;
						} catch {
							result = {
								totalSupply: '21000000',
								note: 'Max supply is 21M TAO',
							};
						}
					} else if (operation === 'getSubnetEmission') {
						const netuid = this.getNodeParameter('netuid', i) as number;
						result = {
							netuid,
							message: 'Emission data requires Taostats API',
						};
					}
				}

				// ============ UTILITY OPERATIONS ============
				else if (resource === 'utility') {
					if (operation === 'raoToTao') {
						const amountRao = this.getNodeParameter('amountRao', i) as string;
						const tao = raoToTao(BigInt(amountRao));
						result = {
							rao: amountRao,
							tao,
							formatted: formatTao(BigInt(amountRao)),
						};
					} else if (operation === 'taoToRao') {
						const amount = this.getNodeParameter('amount', i) as number;
						const rao = taoToRao(amount);
						result = {
							tao: amount,
							rao: rao.toString(),
						};
					} else if (operation === 'validateAddress') {
						const address = this.getNodeParameter('address', i) as string;
						result = getAddressInfo(address);
					} else if (operation === 'generateMnemonic') {
						const { mnemonicGenerate } = await import('@polkadot/util-crypto');
						const words = mnemonicGenerate(12);
						result = {
							mnemonic: words,
							words,
							warning: 'SAVE THIS MNEMONIC SECURELY - IT CANNOT BE RECOVERED',
						};
					}
				}

				returnData.push({
					json: result as IDataObject,
					pairedItem: { item: i },
				});
			}
		} finally {
			await client.disconnect();
		}

		return [returnData];
	}
}
