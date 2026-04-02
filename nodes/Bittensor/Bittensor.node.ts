/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-bittensor/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Bittensor implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bittensor',
    name: 'bittensor',
    icon: 'file:bittensor.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Bittensor API',
    defaults: {
      name: 'Bittensor',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bittensorApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Subnet',
            value: 'subnet',
          },
          {
            name: 'Validator',
            value: 'validator',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Delegation',
            value: 'delegation',
          },
          {
            name: 'Network',
            value: 'network',
          }
        ],
        default: 'subnet',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['subnet'] } },
  options: [
    { name: 'Get All Subnets', value: 'getAllSubnets', description: 'List all active subnets', action: 'Get all subnets' },
    { name: 'Get Subnet', value: 'getSubnet', description: 'Get specific subnet details', action: 'Get subnet details' },
    { name: 'Get Subnet Miners', value: 'getSubnetMiners', description: 'Get miners in subnet', action: 'Get subnet miners' },
    { name: 'Get Subnet Validators', value: 'getSubnetValidators', description: 'Get validators in subnet', action: 'Get subnet validators' },
    { name: 'Get Subnet Metagraph', value: 'getSubnetMetagraph', description: 'Get subnet metagraph data', action: 'Get subnet metagraph' },
    { name: 'Register to Subnet', value: 'registerToSubnet', description: 'Register to a subnet', action: 'Register to subnet' },
    { name: 'Register Subnet', value: 'registerSubnet', description: 'Register a new subnet', action: 'Register subnet' },
    { name: 'Update Subnet', value: 'updateSubnet', description: 'Update subnet configuration', action: 'Update subnet' },
    { name: 'Get Subnet Neurons', value: 'getSubnetNeurons', description: 'Get neurons in subnet', action: 'Get subnet neurons' }
  ],
  default: 'getAllSubnets',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['validator'],
		},
	},
	options: [
		{
			name: 'Get All Validators',
			value: 'getAllValidators',
			description: 'List all validators across network',
			action: 'Get all validators',
		},
		{
			name: 'Get Validator',
			value: 'getValidator',
			description: 'Get specific validator details',
			action: 'Get a validator',
		},
		{
			name: 'Get Validator Performance',
			value: 'getValidatorPerformance',
			description: 'Get validator performance metrics',
			action: 'Get validator performance',
		},
		{
			name: 'Get Validator Emissions',
			value: 'getValidatorEmissions',
			description: 'Get validator emission history',
			action: 'Get validator emissions',
		},
		{
			name: 'Create Validator',
			value: 'createValidator',
			description: 'Register new validator',
			action: 'Create a validator',
		},
		{
			name: 'Register Validator',
			value: 'registerValidator',
			description: 'Register as a validator on the network',
			action: 'Register validator',
		},
		{
			name: 'Update Validator',
			value: 'updateValidator',
			description: 'Update validator configuration',
			action: 'Update a validator',
		},
		{
			name: 'Deregister Validator',
			value: 'deregisterValidator',
			description: 'Deregister validator',
			action: 'Deregister a validator',
		},
		{
			name: 'Get Validator Metrics',
			value: 'getValidatorMetrics',
			description: 'Get validator performance metrics',
			action: 'Get validator metrics',
		},
		{
			name: 'Set Weights',
			value: 'setWeights',
			description: 'Set validator weights for subnet participants',
			action: 'Set validator weights',
		},
	],
	default: 'getAllValidators',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['staking'] } },
  options: [
    { name: 'Get All Stakes', value: 'getAllStakes', description: 'List all stakes for wallet', action: 'Get all stakes' },
    { name: 'Get Stake', value: 'getStake', description: 'Get specific stake details', action: 'Get a stake' },
    { name: 'Add Stake', value: 'addStake', description: 'Add stake to validator', action: 'Add stake' },
    { name: 'Create Stake', value: 'createStake', description: 'Create new stake position', action: 'Create stake' },
    { name: 'Get Stakes', value: 'getStakes', description: 'Get all stakes for an address', action: 'Get stakes for address' },
    { name: 'Modify Stake', value: 'modifyStake', description: 'Modify existing stake amount', action: 'Modify stake' },
    { name: 'Update Stake', value: 'updateStake', description: 'Modify existing stake', action: 'Update stake' },
    { name: 'Remove Stake', value: 'removeStake', description: 'Remove stake from validator', action: 'Remove stake' },
    { name: 'Get Stake Rewards', value: 'getStakeRewards', description: 'Get staking rewards history', action: 'Get stake rewards' },
    { name: 'Get Staking Rewards', value: 'getStakingRewards', description: 'Get staking rewards for address', action: 'Get staking rewards' },
  ],
  default: 'getAllStakes',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['delegation'] } },
  options: [
    { name: 'Get All Delegations', value: 'getAllDelegations', description: 'List all delegations for wallet', action: 'Get all delegations' },
    { name: 'Get Delegation', value: 'getDelegation', description: 'Get specific delegation details', action: 'Get delegation' },
    { name: 'Get Delegations', value: 'getDelegations', description: 'Get delegations for address', action: 'Get delegations for address' },
    { name: 'Create Delegation', value: 'createDelegation', description: 'Delegate TAO to validator', action: 'Create delegation' },
    { name: 'Update Delegation', value: 'updateDelegation', description: 'Update delegation amount', action: 'Update delegation' },
    { name: 'Remove Delegation', value: 'removeDelegation', description: 'Remove delegation', action: 'Remove delegation' },
    { name: 'Get Delegation Returns', value: 'getDelegationReturns', description: 'Get delegation returns history', action: 'Get delegation returns' },
    { name: 'Get Validators', value: 'getValidators', description: 'List available validators for delegation', action: 'Get validators' },
  ],
  default: 'getAllDelegations',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['network'] } },
  options: [
    { name: 'Get Network Stats', value: 'getNetworkStats', description: 'Get overall network statistics', action: 'Get network stats' },
    { name: 'Get Network Statistics', value: 'getNetworkStatistics', description: 'Retrieve network-wide statistics', action: 'Get network statistics' },
    { name: 'Get Blocks', value: 'getBlocks', description: 'Get recent blocks information', action: 'Get blocks' },
    { name: 'Get Block', value: 'getBlock', description: 'Get specific block details', action: 'Get block' },
    { name: 'List Recent Blocks', value: 'getAllBlocks', description: 'Retrieve a list of recent blocks', action: 'List recent blocks' },
    { name: 'Get Difficulty', value: 'getDifficulty', description: 'Get current network difficulty', action: 'Get difficulty' },
    { name: 'Get Network Difficulty', value: 'getNetworkDifficulty', description: 'Get the current network difficulty', action: 'Get network difficulty' },
    { name: 'Get Total Issuance', value: 'getTotalIssuance', description: 'Get total TAO issuance', action: 'Get total issuance' },
    { name: 'Get Tempo', value: 'getTempo', description: 'Get network tempo information', action: 'Get tempo' },
    { name: 'Get Consensus Information', value: 'getConsensus', description: 'Retrieve consensus information for a subnet', action: 'Get consensus information' },
    { name: 'Get Emission Rates', value: 'getEmission', description: 'Get emission rates for a subnet', action: 'Get emission rates' },
  ],
  default: 'getNetworkStats',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 100,
  description: 'Maximum number of results to return',
  displayOptions: { show: { resource: ['subnet'], operation: ['getAllSubnets', 'getSubnetMiners', 'getSubnetValidators', 'getSubnetNeurons'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of results to skip',
  displayOptions: { show: { resource: ['subnet'], operation: ['getAllSubnets', 'getSubnetMiners', 'getSubnetValidators', 'getSubnetNeurons'] } },
},
{
  displayName: 'Subnet ID',
  name: 'subnetId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the subnet',
  displayOptions: { show: { resource: ['subnet'], operation: ['getSubnet', 'getSubnetMiners', 'getSubnetValidators', 'getSubnetMetagraph', 'registerToSubnet'] } },
},
{
  displayName: 'Network UID',
  name: 'netuid',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['subnet'], operation: ['registerSubnet', 'updateSubnet', 'getSubnetNeurons'] } },
  default: 0,
  description: 'The network unique identifier',
},
{
  displayName: 'Subnet Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['subnet'], operation: ['registerSubnet'] } },
  default: '',
  description: 'The name of the subnet to register',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  default: '',
  description: 'Hotkey address for subnet registration',
  displayOptions: { show: { resource: ['subnet'], operation: ['registerToSubnet', 'registerSubnet'] } },
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  default: '',
  description: 'Coldkey address for subnet registration',
  displayOptions: { show: { resource: ['subnet'], operation: ['registerToSubnet', 'registerSubnet'] } },
},
{
  displayName: 'Active Only',
  name: 'activeOnly',
  type: 'boolean',
  displayOptions: { show: { resource: ['subnet'], operation: ['getAllSubnets'] } },
  default: false,
  description: 'Whether to return only active subnets',
},
{
  displayName: 'Configuration',
  name: 'config',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['subnet'], operation: ['updateSubnet'] } },
  default: '{}',
  description: 'Subnet configuration object',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Maximum number of validators to return',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getAllValidators'],
		},
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of validators to skip',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getAllValidators'],
		},
	},
},
{
	displayName: 'Subnet ID',
	name: 'subnetId',
	type: 'number',
	default: '',
	description: 'Filter validators by subnet ID',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getAllValidators'],
		},
	},
},
{
	displayName: 'Active Only',
	name: 'active_only',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getAllValidators'],
		},
	},
	default: false,
	description: 'Return only active validators',
},
{
	displayName: 'Validator UID',
	name: 'validatorUid',
	type: 'string',
	required: true,
	default: '',
	description: 'Unique identifier of the validator',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getValidator', 'getValidatorPerformance', 'getValidatorEmissions', 'updateValidator', 'deregisterValidator'],
		},
	},
},
{
	displayName: 'Period',
	name: 'period',
	type: 'options',
	default: '24h',
	description: 'Performance metrics time period',
	options: [
		{
			name: '1 Hour',
			value: '1h',
		},
		{
			name: '24 Hours',
			value: '24h',
		},
		{
			name: '7 Days',
			value: '7d',
		},
		{
			name: '30 Days',
			value: '30d',
		},
	],
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getValidatorPerformance', 'getValidatorMetrics'],
		},
	},
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	default: '',
	description: 'Start date for emission history',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getValidatorEmissions'],
		},
	},
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	default: '',
	description: 'End date for emission history',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['getValidatorEmissions'],
		},
	},
},
{
	displayName: 'Hotkey',
	name: 'hotkey',
	type: 'string',
	required: true,
	default: '',
	description: 'Validator hotkey address',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['createValidator', 'registerValidator', 'getValidatorMetrics', 'setWeights'],
		},
	},
},
{
	displayName: 'Coldkey',
	name: 'coldkey',
	type: 'string',
	required: true,
	default: '',
	description: 'Validator coldkey address',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['createValidator', 'registerValidator'],
		},
	},
},
{
	displayName: 'Subnet ID',
	name: 'subnetIdCreate',
	type: 'number',
	required: true,
	default: '',
	description: 'Subnet to register validator on',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['createValidator'],
		},
	},
},
{
	displayName: 'Subnet ID',
	name: 'subnet_id',
	type: 'number',
	required: true,
	default: 0,
	description: 'The subnet ID to register the validator on',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['registerValidator'],
		},
	},
},
{
	displayName: 'Configuration',
	name: 'config',
	type: 'json',
	required: true,
	default: '{}',
	description: 'Validator configuration object',
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['updateValidator'],
		},
	},
},
{
	displayName: 'Weights',
	name: 'weights',
	type: 'json',
	required: false,
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['updateValidator'],
		},
	},
	default: '{}',
	description: 'Validator weights as JSON object',
},
{
	displayName: 'Weights',
	name: 'weights',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['setWeights'],
		},
	},
	default: '{}',
	description: 'Weights to set as JSON object',
},
{
	displayName: 'Version Key',
	name: 'version_key',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['validator'],
			operation: ['setWeights'],
		},
	},
	default: '',
	description: 'Version key for the weights operation',
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['getAllStakes', 'addStake', 'getStakeRewards', 'createStake'] } },
  default: '',
  description: 'Wallet coldkey address',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['staking'], operation: ['getAllStakes'] } },
  default: 100,
  description: 'Number of stakes to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['staking'], operation: ['getAllStakes'] } },
  default: 0,
  description: 'Number of stakes to skip',
},
{
  displayName: 'Subnet ID',
  name: 'subnet_id',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['staking'], operation: ['getAllStakes'] } },
  default: '',
  description: 'Filter stakes by subnet ID',
},
{
  displayName: 'Stake ID',
  name: 'stakeId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['getStake', 'modifyStake', 'removeStake', 'updateStake'] } },
  default: '',
  description: 'Unique identifier for the stake',
},
{
  displayName: 'Validator UID',
  name: 'validatorUid',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['addStake'] } },
  default: '',
  description: 'Validator unique identifier to stake to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['addStake', 'modifyStake', 'createStake', 'updateStake'] } },
  default: '',
  description: 'Amount of TAO to stake',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['addStake', 'createStake'] } },
  default: '',
  description: 'Wallet hotkey address',
},
{
  displayName: 'Target',
  name: 'target',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['createStake'] } },
  default: '',
  description: 'The target validator or miner to stake to',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['getStakes', 'getStakingRewards'] } },
  default: '',
  description: 'The address to get stakes or rewards for',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['staking'], operation: ['getStakeRewards'] } },
  default: '',
  description: 'Start date for rewards history',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['staking'], operation: ['getStakeRewards'] } },
  default: '',
  description: 'End date for rewards history',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['staking'], operation: ['getStakingRewards'] } },
  options: [
    {
      name: 'Daily',
      value: 'daily',
    },
    {
      name: 'Weekly',
      value: 'weekly',
    },
    {
      name: 'Monthly',
      value: 'monthly',
    },
    {
      name: 'All Time',
      value: 'all',
    },
  ],
  default: 'daily',
  description: 'The time period for rewards calculation',
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations', 'createDelegation', 'getDelegationReturns'] } },
  default: '',
  description: 'Wallet coldkey address for delegation queries',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations'] } },
  default: 100,
  description: 'Maximum number of delegations to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations'] } },
  default: 0,
  description: 'Number of delegations to skip for pagination',
},
{
  displayName: 'Validator Hotkey',
  name: 'validatorHotkey',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations'] } },
  default: '',
  description: 'Filter by validator hotkey',
},
{
  displayName: 'Delegation ID',
  name: 'delegationId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['getDelegation', 'updateDelegation', 'removeDelegation'] } },
  default: '',
  description: 'Unique identifier of the delegation',
},
{
  displayName: 'Validator UID',
  name: 'validatorUid',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['createDelegation'] } },
  default: '',
  description: 'Unique identifier of the validator to delegate to',
},
{
  displayName: 'Validator Hotkey',
  name: 'validatorHotkey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['createDelegation'] } },
  default: '',
  description: 'The hotkey of the validator to delegate to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['createDelegation', 'updateDelegation'] } },
  default: '',
  description: 'Amount of TAO to delegate',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['getDelegations'] } },
  default: '',
  description: 'The address to get delegations for',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['delegation'], operation: ['getDelegationReturns'] } },
  default: '',
  description: 'Start date for delegation returns history',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['delegation'], operation: ['getDelegationReturns'] } },
  default: '',
  description: 'End date for delegation returns history',
},
{
  displayName: 'Subnet ID',
  name: 'subnetId',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getValidators'] } },
  default: '',
  description: 'Filter validators by subnet ID',
},
{
  displayName: 'Minimum Stake',
  name: 'minStake',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getValidators'] } },
  default: 0,
  description: 'Minimum stake amount for validators',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 10,
  description: 'Number of blocks to retrieve',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getBlocks', 'getAllBlocks']
    }
  }
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of blocks to skip',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getBlocks', 'getAllBlocks']
    }
  }
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  required: true,
  default: 0,
  description: 'The specific block number to retrieve',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getBlock']
    }
  }
},
{
  displayName: 'Network UID',
  name: 'netuid',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getDifficulty', 'getNetworkDifficulty', 'getConsensus', 'getEmission'],
    },
  },
  default: 1,
  description: 'The network/subnet UID',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'subnet':
        return [await executeSubnetOperations.call(this, items)];
      case 'validator':
        return [await executeValidatorOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'delegation':
        return [await executeDelegationOperations.call(this, items)];
      case 'network':
        return [await executeNetworkOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeSubnetOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bittensorApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllSubnets': {
          const activeOnly = this.getNodeParameter('activeOnly', i, false) as boolean;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams();
          if (activeOnly) {
            queryParams.append('active_only', 'true');
          }
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubnet': {
          const subnetId = this.getNodeParameter('subnetId', i) as string;
          const netuid = this.getNodeParameter('netuid', i) as number;

          const id = subnetId || netuid;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubnetMiners': {
          const subnetId = this.getNodeParameter('subnetId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${subnetId}/miners`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubnetValidators': {
          const subnetId = this.getNodeParameter('subnetId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${subnetId}/validators`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubnetMetagraph': {
          const subnetId = this.getNodeParameter('subnetId', i) as string;
          const netuid = this.getNodeParameter('netuid', i) as number;

          const id = subnetId || netuid;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${id}/metagraph`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'registerToSubnet': {
          const subnetId = this.getNodeParameter('subnetId', i) as string;
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subnets/${subnetId}/register`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              hotkey,
              coldkey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'registerSubnet': {
          const name = this.getNodeParameter('name', i) as string;
          const netuid = this.getNodeParameter('netuid', i) as number;
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const hotkey = this.getNodeParameter('hotkey', i) as string;

          const body = {
            name,
            netuid,
            coldkey,
            hotkey,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subnets/register`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSubnet': {
          const netuid = this.getNodeParameter('netuid', i) as number;
          const config = this.getNodeParameter('config', i) as string;

          let parsedConfig: any;
          try {
            parsedConfig = JSON.parse(config);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in configuration: ${error.message}`);
          }

          const body = {
            config: parsedConfig,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/subnets/${netuid}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubnetNeurons': {
          const netuid = this.getNodeParameter('netuid', i) as number;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${netuid}/neurons?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeValidatorOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bittensorApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllValidators': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const subnetId = this.getNodeParameter('subnetId', i) as number;
					const active_only = this.getNodeParameter('active_only', i, false) as boolean;

					const qs: any = {
						limit,
						offset,
					};

					if (subnetId) {
						qs.subnet_id = subnetId;
					}
					if (active_only) qs.active_only = active_only;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/validators`,
						qs,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getValidator': {
					const validatorUid = this.getNodeParameter('validatorUid', i) as string;
					const hotkey = this.getNodeParameter('hotkey', i) as string;

					const identifier = validatorUid || hotkey;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/validators/${encodeURIComponent(identifier)}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getValidatorPerformance': {
					const validatorUid = this.getNodeParameter('validatorUid', i) as string;
					const period = this.getNodeParameter('period', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/validators/${validatorUid}/performance`,
						qs: {
							period,
						},
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getValidatorEmissions': {
					const validatorUid = this.getNodeParameter('validatorUid', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;

					const qs: any = {};
					if (startDate) qs.start_date = startDate;
					if (endDate) qs.end_date = endDate;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/validators/${validatorUid}/emissions`,
						qs,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createValidator':
				case 'registerValidator': {
					const hotkey = this.getNodeParameter('hotkey', i) as string;
					const coldkey = this.getNodeParameter('coldkey', i) as string;
					const subnetId = this.getNodeParameter('subnetIdCreate', i, undefined) as number | undefined;
					const subnet_id = this.getNodeParameter('subnet_id', i, undefined) as number | undefined;

					const body = {
						hotkey,
						coldkey,
						subnet_id: subnetId || subnet_id,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/validators${operation === 'registerValidator' ? '/register' : ''}`,
						body,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateValidator': {
					const validatorUid = this.getNodeParameter('validatorUid', i) as string;
					const hotkey = this.getNodeParameter('hotkey', i) as string;
					const config = this.getNodeParameter('config', i) as string;
					const weights = this.getNodeParameter('weights', i, '{}') as string;

					const identifier = validatorUid || hotkey;
					
					const body: any = {};

					let parsedConfig: any;
					try {
						parsedConfig = JSON.parse(config);
						body.config = parsedConfig;
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid JSON in config: ${error.message}`);
					}

					try {
						if (weights && weights !== '{}') {
							body.weights = JSON.parse(weights);
						}
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid weights JSON: ${error.message}`);
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/validators/${encodeURIComponent(identifier)}`,
						body,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deregisterValidator': {
					const validatorUid = this.getNodeParameter('validatorUid', i) as string;
					const hotkey = this.getNodeParameter('hotkey', i) as string;

					const identifier = validatorUid || hotkey;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/validators/${encodeURIComponent(identifier)}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getValidatorMetrics': {
					const hotkey = this.getNodeParameter('hotkey', i) as string;
					const period = this.getNodeParameter('period', i, '24h') as string;

					const queryString = period ? `?period=${period}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/validators/${encodeURIComponent(hotkey)}/metrics${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'setWeights': {
					const hotkey = this.getNodeParameter('hotkey', i) as string;
					const weights = this.getNodeParameter('weights', i) as string;
					const version_key = this.getNodeParameter('version_key', i, '') as string;

					let parsedWeights: any;
					try {
						parsedWeights = JSON.parse(weights);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid weights JSON: ${error.message}`);
					}

					const body: any = {
						weights: parsedWeights,
					};

					if (version_key) {
						body.version_key = version_key;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/validators/${encodeURIComponent(hotkey)}/weights`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				if (error.httpCode) {
					throw new NodeApiError(this.getNode(), error);
				} else {
					throw new NodeOperationError(this.getNode(), error.message);
				}
			}
		}
	}

	return returnData;
}

async function executeStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bittensorApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllStakes': {
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const subnetId = this.getNodeParameter('subnet_id', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          if (subnetId) {
            queryParams.append('subnet_id', subnetId);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/stakes?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              coldkey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStake': {
          const stakeId = this.getNodeParameter('stakeId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/stakes/${stakeId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addStake': {
          const validatorUid = this.getNodeParameter('validatorUid', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/stakes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              validator_uid: validatorUid,
              amount,
              coldkey,
              hotkey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createStake': {
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const target = this.getNodeParameter('target', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/staking/stake`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              hotkey,
              coldkey,
              amount,
              target,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakes': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/staking/stakes/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'modifyStake':
        case 'updateStake': {
          const stakeId = this.getNodeParameter('stakeId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          
          const url = operation === 'updateStake' ? 
            `${credentials.baseUrl}/staking/stakes/${stakeId}` :
            `${credentials.baseUrl}/stakes/${stakeId}`;

          const options: any = {
            method: 'PUT',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              amount,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'removeStake': {
          const stakeId = this.getNodeParameter('stakeId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/stakes/${stakeId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakeRewards': {
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const startDate = this.getNodeParameter('startDate', i, '') as string;
          const endDate = this.getNodeParameter('endDate', i, '') as string;
          
          const qs: any = { coldkey };
          if (startDate) qs.start_date = startDate;
          if (endDate) qs.end_date = endDate;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/stakes/rewards`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakingRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const period = this.getNodeParameter('period', i) as string;

          const queryParams = new URLSearchParams();
          if (period) {
            queryParams.append('period', period);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/staking/rewards/${address}?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeDelegationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bittensorApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllDelegations': {
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const validatorHotkey = this.getNodeParameter('validatorHotkey', i) as string;

          const qs: any = { coldkey };
          if (limit) qs.limit = limit;
          if (offset) qs.offset = offset;
          if (validatorHotkey) qs.validator_hotkey = validatorHotkey;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegations`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegation': {
          const delegationId = this.getNodeParameter('delegationId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegations/${delegationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegations': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegation/delegations/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createDelegation': {
          const validatorUid = this.getNodeParameter('validatorUid', i) as string;
          const validatorHotkey = this.getNodeParameter('validatorHotkey', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const coldkey = this.getNodeParameter('coldkey', i) as string;

          const body: any = {
            amount,
            coldkey,
          };

          if (validatorUid) {
            body.validator_uid = validatorUid;
          } else if (validatorHotkey) {
            body.validator_hotkey = validatorHotkey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/delegations`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDelegation': {
          const delegationId = this.getNodeParameter('delegationId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/delegations/${delegationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              amount,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'removeDelegation': {
          const delegationId = this.getNodeParameter('delegationId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/delegations/${delegationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegationReturns': {
          const coldkey = this.getNodeParameter('coldkey',