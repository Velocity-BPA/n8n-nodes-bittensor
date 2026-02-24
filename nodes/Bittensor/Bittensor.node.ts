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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Delegation',
            value: 'delegation',
          },
          {
            name: 'Subnets',
            value: 'subnets',
          },
          {
            name: 'Validators',
            value: 'validators',
          },
          {
            name: 'Network',
            value: 'network',
          }
        ],
        default: 'staking',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['staking'],
    },
  },
  options: [
    {
      name: 'Create Stake',
      value: 'createStake',
      description: 'Create new stake position',
      action: 'Create stake',
    },
    {
      name: 'Get Stakes',
      value: 'getStakes',
      description: 'Get all stakes for an address',
      action: 'Get stakes for address',
    },
    {
      name: 'Get All Stakes',
      value: 'getAllStakes',
      description: 'List all active stakes',
      action: 'Get all stakes',
    },
    {
      name: 'Update Stake',
      value: 'updateStake',
      description: 'Modify existing stake',
      action: 'Update stake',
    },
    {
      name: 'Remove Stake',
      value: 'removeStake',
      description: 'Remove stake position',
      action: 'Remove stake',
    },
    {
      name: 'Get Staking Rewards',
      value: 'getStakingRewards',
      description: 'Get staking rewards for address',
      action: 'Get staking rewards',
    },
  ],
  default: 'createStake',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
    },
  },
  options: [
    {
      name: 'Create Delegation',
      value: 'createDelegation',
      description: 'Delegate TAO to validator',
      action: 'Create delegation',
    },
    {
      name: 'Get Delegations',
      value: 'getDelegations',
      description: 'Get delegations for address',
      action: 'Get delegations for address',
    },
    {
      name: 'Get All Delegations',
      value: 'getAllDelegations',
      description: 'List all delegations',
      action: 'Get all delegations',
    },
    {
      name: 'Update Delegation',
      value: 'updateDelegation',
      description: 'Modify delegation amount',
      action: 'Update delegation',
    },
    {
      name: 'Remove Delegation',
      value: 'removeDelegation',
      description: 'Remove delegation',
      action: 'Remove delegation',
    },
    {
      name: 'Get Validators',
      value: 'getValidators',
      description: 'List available validators for delegation',
      action: 'Get validators',
    },
  ],
  default: 'createDelegation',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['subnets'],
    },
  },
  options: [
    {
      name: 'Register Subnet',
      value: 'registerSubnet',
      description: 'Register a new subnet',
      action: 'Register subnet',
    },
    {
      name: 'Get Subnet',
      value: 'getSubnet',
      description: 'Get subnet details by netuid',
      action: 'Get subnet',
    },
    {
      name: 'Get All Subnets',
      value: 'getAllSubnets',
      description: 'List all subnets',
      action: 'Get all subnets',
    },
    {
      name: 'Update Subnet',
      value: 'updateSubnet',
      description: 'Update subnet configuration',
      action: 'Update subnet',
    },
    {
      name: 'Get Subnet Neurons',
      value: 'getSubnetNeurons',
      description: 'Get neurons in subnet',
      action: 'Get subnet neurons',
    },
    {
      name: 'Get Subnet Metagraph',
      value: 'getSubnetMetagraph',
      description: 'Get subnet metagraph data',
      action: 'Get subnet metagraph',
    },
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
      resource: ['validators'],
    },
  },
  options: [
    {
      name: 'Register Validator',
      value: 'registerValidator',
      description: 'Register as a validator on the network',
      action: 'Register validator',
    },
    {
      name: 'Get Validator',
      value: 'getValidator',
      description: 'Get details of a specific validator',
      action: 'Get validator details',
    },
    {
      name: 'Get All Validators',
      value: 'getAllValidators',
      description: 'List all validators with optional filtering',
      action: 'Get all validators',
    },
    {
      name: 'Update Validator',
      value: 'updateValidator',
      description: 'Update validator settings and configuration',
      action: 'Update validator settings',
    },
    {
      name: 'Deregister Validator',
      value: 'deregisterValidator',
      description: 'Deregister validator from the network',
      action: 'Deregister validator',
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
  default: 'registerValidator',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['network'],
    },
  },
  options: [
    {
      name: 'Get Network Statistics',
      value: 'getNetworkStats',
      description: 'Retrieve network-wide statistics',
      action: 'Get network statistics',
    },
    {
      name: 'Get Block',
      value: 'getBlock',
      description: 'Get information about a specific block',
      action: 'Get block information',
    },
    {
      name: 'List Recent Blocks',
      value: 'getAllBlocks',
      description: 'Retrieve a list of recent blocks',
      action: 'List recent blocks',
    },
    {
      name: 'Get Network Difficulty',
      value: 'getDifficulty',
      description: 'Get the current network difficulty',
      action: 'Get network difficulty',
    },
    {
      name: 'Get Consensus Information',
      value: 'getConsensus',
      description: 'Retrieve consensus information for a subnet',
      action: 'Get consensus information',
    },
    {
      name: 'Get Emission Rates',
      value: 'getEmission',
      description: 'Get emission rates for a subnet',
      action: 'Get emission rates',
    },
  ],
  default: 'getNetworkStats',
},
      // Parameter definitions
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake'],
    },
  },
  default: '',
  description: 'The hotkey for the stake',
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake'],
    },
  },
  default: '',
  description: 'The coldkey for the stake',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake', 'updateStake'],
    },
  },
  default: '',
  description: 'The amount to stake in TAO',
},
{
  displayName: 'Target',
  name: 'target',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake'],
    },
  },
  default: '',
  description: 'The target validator or miner to stake to',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakes', 'getStakingRewards'],
    },
  },
  default: '',
  description: 'The address to get stakes or rewards for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getAllStakes'],
    },
  },
  default: 100,
  description: 'Maximum number of stakes to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getAllStakes'],
    },
  },
  default: 0,
  description: 'Number of stakes to skip',
},
{
  displayName: 'Subnet ID',
  name: 'subnet_id',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getAllStakes'],
    },
  },
  default: '',
  description: 'Filter stakes by subnet ID',
},
{
  displayName: 'Stake ID',
  name: 'stake_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['updateStake', 'removeStake'],
    },
  },
  default: '',
  description: 'The ID of the stake to modify or remove',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakingRewards'],
    },
  },
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
  displayName: 'Validator Hotkey',
  name: 'validatorHotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['createDelegation'],
    },
  },
  default: '',
  description: 'The hotkey of the validator to delegate to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['createDelegation'],
    },
  },
  default: 0,
  description: 'Amount of TAO to delegate',
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['createDelegation'],
    },
  },
  default: '',
  description: 'Your coldkey address',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegations'],
    },
  },
  default: '',
  description: 'The address to get delegations for',
},
{
  displayName: 'Validator Hotkey',
  name: 'validatorHotkey',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getAllDelegations'],
    },
  },
  default: '',
  description: 'Filter by validator hotkey',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getAllDelegations'],
    },
  },
  default: 100,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getAllDelegations'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Delegation ID',
  name: 'delegationId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['updateDelegation'],
    },
  },
  default: '',
  description: 'The ID of the delegation to update',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['updateDelegation'],
    },
  },
  default: 0,
  description: 'New delegation amount',
},
{
  displayName: 'Delegation ID',
  name: 'delegationId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['removeDelegation'],
    },
  },
  default: '',
  description: 'The ID of the delegation to remove',
},
{
  displayName: 'Subnet ID',
  name: 'subnetId',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getValidators'],
    },
  },
  default: '',
  description: 'Filter validators by subnet ID',
},
{
  displayName: 'Minimum Stake',
  name: 'minStake',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getValidators'],
    },
  },
  default: 0,
  description: 'Minimum stake amount for validators',
},
{
  displayName: 'Subnet Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['registerSubnet'],
    },
  },
  default: '',
  description: 'The name of the subnet to register',
},
{
  displayName: 'Network UID',
  name: 'netuid',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['registerSubnet', 'getSubnet', 'updateSubnet', 'getSubnetNeurons', 'getSubnetMetagraph'],
    },
  },
  default: 0,
  description: 'The network unique identifier',
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['registerSubnet'],
    },
  },
  default: '',
  description: 'The coldkey for subnet registration',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['registerSubnet'],
    },
  },
  default: '',
  description: 'The hotkey for subnet registration',
},
{
  displayName: 'Active Only',
  name: 'activeOnly',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['getAllSubnets'],
    },
  },
  default: false,
  description: 'Whether to return only active subnets',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['getAllSubnets', 'getSubnetNeurons'],
    },
  },
  default: 100,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['getAllSubnets', 'getSubnetNeurons'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Configuration',
  name: 'config',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['subnets'],
      operation: ['updateSubnet'],
    },
  },
  default: '{}',
  description: 'Subnet configuration object',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['registerValidator'],
    },
  },
  default: '',
  description: 'The hotkey address for the validator',
},
{
  displayName: 'Coldkey',
  name: 'coldkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['registerValidator'],
    },
  },
  default: '',
  description: 'The coldkey address for the validator',
},
{
  displayName: 'Subnet ID',
  name: 'subnet_id',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['registerValidator'],
    },
  },
  default: 0,
  description: 'The subnet ID to register the validator on',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getValidator'],
    },
  },
  default: '',
  description: 'The hotkey address of the validator to retrieve',
},
{
  displayName: 'Subnet ID',
  name: 'subnet_id',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getAllValidators'],
    },
  },
  default: 0,
  description: 'Filter validators by subnet ID',
},
{
  displayName: 'Active Only',
  name: 'active_only',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getAllValidators'],
    },
  },
  default: false,
  description: 'Return only active validators',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getAllValidators'],
    },
  },
  default: 100,
  description: 'Maximum number of validators to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getAllValidators'],
    },
  },
  default: 0,
  description: 'Number of validators to skip',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['updateValidator'],
    },
  },
  default: '',
  description: 'The hotkey address of the validator to update',
},
{
  displayName: 'Weights',
  name: 'weights',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['updateValidator'],
    },
  },
  default: '{}',
  description: 'Validator weights as JSON object',
},
{
  displayName: 'Config',
  name: 'config',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['updateValidator'],
    },
  },
  default: '{}',
  description: 'Validator configuration as JSON object',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['deregisterValidator'],
    },
  },
  default: '',
  description: 'The hotkey address of the validator to deregister',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getValidatorMetrics'],
    },
  },
  default: '',
  description: 'The hotkey address of the validator',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['getValidatorMetrics'],
    },
  },
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
  default: '24h',
  description: 'Time period for metrics',
},
{
  displayName: 'Hotkey',
  name: 'hotkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
      operation: ['setWeights'],
    },
  },
  default: '',
  description: 'The hotkey address of the validator',
},
{
  displayName: 'Weights',
  name: 'weights',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['validators'],
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
      resource: ['validators'],
      operation: ['setWeights'],
    },
  },
  default: '',
  description: 'Version key for the weights operation',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getBlock'],
    },
  },
  default: 0,
  description: 'The block number to retrieve information for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getAllBlocks'],
    },
  },
  default: 10,
  description: 'Maximum number of blocks to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getAllBlocks'],
    },
  },
  default: 0,
  description: 'Number of blocks to skip',
},
{
  displayName: 'Network UID',
  name: 'netuid',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['network'],
      operation: ['getDifficulty', 'getConsensus', 'getEmission'],
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
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'delegation':
        return [await executeDelegationOperations.call(this, items)];
      case 'subnets':
        return [await executeSubnetsOperations.call(this, items)];
      case 'validators':
        return [await executeValidatorsOperations.call(this, items)];
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

        case 'getAllStakes': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const subnetId = this.getNodeParameter('subnet_id', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          if (subnetId) {
            queryParams.append('subnet_id', subnetId);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/staking/stakes?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateStake': {
          const stakeId = this.getNodeParameter('stake_id', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/staking/stakes/${stakeId}`,
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
          const stakeId = this.getNodeParameter('stake_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/staking/stakes/${stakeId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
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

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
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
        case 'createDelegation': {
          const validatorHotkey = this.getNodeParameter('validatorHotkey', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/delegation/delegate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              validator_hotkey: validatorHotkey,
              amount: amount,
              coldkey: coldkey,
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
        
        case 'getAllDelegations': {
          const validatorHotkey = this.getNodeParameter('validatorHotkey', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const queryParams: any = {};
          if (validatorHotkey) queryParams.validator_hotkey = validatorHotkey;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;
          
          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/delegation/delegations${queryString ? '?' + queryString : ''}`;
          
          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateDelegation': {
          const delegationId = this.getNodeParameter('delegationId', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/delegation/delegations/${delegationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              amount: amount,
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
            url: `${credentials.baseUrl}/delegation/delegations/${delegationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getValidators': {
          const subnetId = this.getNodeParameter('subnetId', i) as number;
          const minStake = this.getNodeParameter('minStake', i) as number;
          
          const queryParams: any = {};
          if (subnetId) queryParams.subnet_id = subnetId;
          if (minStake) queryParams.min_stake = minStake;
          
          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/delegation/validators${queryString ? '?' + queryString : ''}`;
          
          const options: any = {
            method: 'GET',
            url: url,
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
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
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

async function executeSubnetsOperations(
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

        case 'getSubnet': {
          const netuid = this.getNodeParameter('netuid', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${netuid}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

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

        case 'getSubnetMetagraph': {
          const netuid = this.getNodeParameter('netuid', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subnets/${netuid}/metagraph`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
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

async function executeValidatorsOperations(
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
        case 'registerValidator': {
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          const coldkey = this.getNodeParameter('coldkey', i) as string;
          const subnet_id = this.getNodeParameter('subnet_id', i) as number;
          
          const body = {
            hotkey,
            coldkey,
            subnet_id,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/validators/register`,
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
        
        case 'getValidator': {
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators/${encodeURIComponent(hotkey)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAllValidators': {
          const subnet_id = this.getNodeParameter('subnet_id', i, undefined) as number | undefined;
          const active_only = this.getNodeParameter('active_only', i, false) as boolean;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const queryParams: string[] = [];
          if (subnet_id !== undefined) queryParams.push(`subnet_id=${subnet_id}`);
          if (active_only) queryParams.push(`active_only=${active_only}`);
          if (limit) queryParams.push(`limit=${limit}`);
          if (offset) queryParams.push(`offset=${offset}`);
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateValidator': {
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          const weights = this.getNodeParameter('weights', i, '{}') as string;
          const config = this.getNodeParameter('config', i, '{}') as string;
          
          const body: any = {};
          
          try {
            if (weights && weights !== '{}') {
              body.weights = JSON.parse(weights);
            }
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid weights JSON: ${error.message}`);
          }
          
          try {
            if (config && config !== '{}') {
              body.config = JSON.parse(config);
            }
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid config JSON: ${error.message}`);
          }
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/validators/${encodeURIComponent(hotkey)}`,
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
        
        case 'deregisterValidator': {
          const hotkey = this.getNodeParameter('hotkey', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/validators/${encodeURIComponent(hotkey)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeNetworkOperations(
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
        case 'getNetworkStats': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/stats`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlock': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/blocks/${blockNumber}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllBlocks': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/blocks?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDifficulty': {
          const netuid = this.getNodeParameter('netuid', i) as number;
          const queryParams = new URLSearchParams();
          queryParams.append('netuid', netuid.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/difficulty?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getConsensus': {
          const netuid = this.getNodeParameter('netuid', i) as number;
          const queryParams = new URLSearchParams();
          queryParams.append('netuid', netuid.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/consensus?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEmission': {
          const netuid = this.getNodeParameter('netuid', i) as number;
          const queryParams = new URLSearchParams();
          queryParams.append('netuid', netuid.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/emission?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
