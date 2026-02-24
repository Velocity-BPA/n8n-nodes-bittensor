/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Bittensor } from '../nodes/Bittensor/Bittensor.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Bittensor Node', () => {
  let node: Bittensor;

  beforeAll(() => {
    node = new Bittensor();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Bittensor');
      expect(node.description.name).toBe('bittensor');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bittensor.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createStake', () => {
    it('should create a new stake successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createStake';
          case 'hotkey': return 'test-hotkey';
          case 'coldkey': return 'test-coldkey';
          case 'amount': return '100.0';
          case 'target': return 'test-target';
          default: return undefined;
        }
      });

      const mockResponse = { 
        stake_id: 'stake-123',
        status: 'created',
        amount: '100.0'
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.bittensor.com/v1/staking/stake',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          hotkey: 'test-hotkey',
          coldkey: 'test-coldkey',
          amount: '100.0',
          target: 'test-target',
        },
        json: true,
      });
    });
  });

  describe('getStakes', () => {
    it('should get stakes for an address successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getStakes';
          case 'address': return 'test-address';
          default: return undefined;
        }
      });

      const mockResponse = {
        stakes: [
          { stake_id: 'stake-1', amount: '100.0' },
          { stake_id: 'stake-2', amount: '200.0' }
        ]
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/staking/stakes/test-address',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getAllStakes', () => {
    it('should get all stakes with pagination', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllStakes';
          case 'limit': return 50;
          case 'offset': return 10;
          case 'subnet_id': return 'subnet-1';
          default: return undefined;
        }
      });

      const mockResponse = {
        stakes: [],
        total: 0,
        limit: 50,
        offset: 10
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/staking/stakes?limit=50&offset=10&subnet_id=subnet-1',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('updateStake', () => {
    it('should update stake successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'updateStake';
          case 'stake_id': return 'stake-123';
          case 'amount': return '150.0';
          default: return undefined;
        }
      });

      const mockResponse = {
        stake_id: 'stake-123',
        status: 'updated',
        amount: '150.0'
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('removeStake', () => {
    it('should remove stake successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'removeStake';
          case 'stake_id': return 'stake-123';
          default: return undefined;
        }
      });

      const mockResponse = {
        stake_id: 'stake-123',
        status: 'removed'
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getStakingRewards', () => {
    it('should get staking rewards successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getStakingRewards';
          case 'address': return 'test-address';
          case 'period': return 'daily';
          default: return undefined;
        }
      });

      const mockResponse = {
        address: 'test-address',
        period: 'daily',
        total_rewards: '10.5',
        rewards: []
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getStakes';
          case 'address': return 'invalid-address';
          default: return undefined;
        }
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getStakes';
          case 'address': return 'invalid-address';
          default: return undefined;
        }
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Delegation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bittensor.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createDelegation', () => {
    it('should create delegation successfully', async () => {
      const mockResponse = {
        success: true,
        delegation_id: 'del_123',
        amount: 100,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createDelegation';
          case 'validatorHotkey': return 'validator_hotkey_123';
          case 'amount': return 100;
          case 'coldkey': return 'coldkey_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.bittensor.com/v1/delegation/delegate',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          validator_hotkey: 'validator_hotkey_123',
          amount: 100,
          coldkey: 'coldkey_123',
        },
        json: true,
      });
    });

    it('should handle createDelegation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createDelegation';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getDelegations', () => {
    it('should get delegations for address successfully', async () => {
      const mockResponse = {
        delegations: [
          { id: 'del_1', amount: 100, validator: 'val_1' },
          { id: 'del_2', amount: 200, validator: 'val_2' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDelegations';
          case 'address': return 'test_address_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/delegation/delegations/test_address_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getAllDelegations', () => {
    it('should get all delegations with filters', async () => {
      const mockResponse = {
        delegations: [],
        total: 0,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllDelegations';
          case 'validatorHotkey': return 'validator_123';
          case 'limit': return 50;
          case 'offset': return 10;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateDelegation', () => {
    it('should update delegation successfully', async () => {
      const mockResponse = {
        success: true,
        delegation_id: 'del_123',
        new_amount: 150,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'updateDelegation';
          case 'delegationId': return 'del_123';
          case 'amount': return 150;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.bittensor.com/v1/delegation/delegations/del_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          amount: 150,
        },
        json: true,
      });
    });
  });

  describe('removeDelegation', () => {
    it('should remove delegation successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Delegation removed',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'removeDelegation';
          case 'delegationId': return 'del_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.bittensor.com/v1/delegation/delegations/del_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getValidators', () => {
    it('should get validators with filters', async () => {
      const mockResponse = {
        validators: [
          { hotkey: 'val_1', stake: 1000, subnet_id: 1 },
          { hotkey: 'val_2', stake: 2000, subnet_id: 1 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          case 'subnetId': return 1;
          case 'minStake': return 500;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Subnets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bittensor.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should register subnet successfully', async () => {
    const mockResponse = {
      success: true,
      netuid: 123,
      message: 'Subnet registered successfully',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'registerSubnet';
        case 'name': return 'Test Subnet';
        case 'netuid': return 123;
        case 'coldkey': return 'test-coldkey';
        case 'hotkey': return 'test-hotkey';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.bittensor.com/v1/subnets/register',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Test Subnet',
        netuid: 123,
        coldkey: 'test-coldkey',
        hotkey: 'test-hotkey',
      },
      json: true,
    });
  });

  test('should get subnet details successfully', async () => {
    const mockResponse = {
      netuid: 123,
      name: 'Test Subnet',
      neurons: 50,
      active: true,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getSubnet';
        case 'netuid': return 123;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bittensor.com/v1/subnets/123',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get all subnets successfully', async () => {
    const mockResponse = {
      subnets: [
        { netuid: 1, name: 'Subnet 1' },
        { netuid: 2, name: 'Subnet 2' },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAllSubnets';
        case 'activeOnly': return true;
        case 'limit': return 100;
        case 'offset': return 0;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bittensor.com/v1/subnets?active_only=true&limit=100&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should update subnet successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Subnet updated successfully',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateSubnet';
        case 'netuid': return 123;
        case 'config': return '{"max_neurons": 100}';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.bittensor.com/v1/subnets/123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        config: { max_neurons: 100 },
      },
      json: true,
    });
  });

  test('should get subnet neurons successfully', async () => {
    const mockResponse = {
      neurons: [
        { uid: 1, hotkey: 'hotkey1' },
        { uid: 2, hotkey: 'hotkey2' },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getSubnetNeurons';
        case 'netuid': return 123;
        case 'limit': return 50;
        case 'offset': return 10;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bittensor.com/v1/subnets/123/neurons?limit=50&offset=10',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get subnet metagraph successfully', async () => {
    const mockResponse = {
      netuid: 123,
      metagraph: {
        nodes: 50,
        edges: 100,
        weights: [],
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getSubnetMetagraph';
        case 'netuid': return 123;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bittensor.com/v1/subnets/123/metagraph',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    const mockError = new Error('API Error');
    mockError.httpCode = 400;

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getSubnet';
        case 'netuid': return 123;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  test('should handle invalid JSON configuration', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateSubnet';
        case 'netuid': return 123;
        case 'config': return 'invalid-json';
        default: return undefined;
      }
    });

    await expect(executeSubnetsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });
});

describe('Validators Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bittensor.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('registerValidator', () => {
    it('should register validator successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'registerValidator';
          case 'hotkey': return 'test-hotkey';
          case 'coldkey': return 'test-coldkey';
          case 'subnet_id': return 1;
          default: return undefined;
        }
      });

      const mockResponse = { success: true, validator_id: 'validator-123' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.bittensor.com/v1/validators/register',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          hotkey: 'test-hotkey',
          coldkey: 'test-coldkey',
          subnet_id: 1,
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getValidator', () => {
    it('should get validator details successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidator';
          case 'hotkey': return 'test-hotkey';
          default: return undefined;
        }
      });

      const mockResponse = { hotkey: 'test-hotkey', stake: 1000, active: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/validators/test-hotkey',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAllValidators', () => {
    it('should get all validators with filters successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        switch (param) {
          case 'operation': return 'getAllValidators';
          case 'subnet_id': return defaultValue !== undefined ? defaultValue : 1;
          case 'active_only': return defaultValue !== undefined ? defaultValue : true;
          case 'limit': return defaultValue !== undefined ? defaultValue : 50;
          case 'offset': return defaultValue !== undefined ? defaultValue : 0;
          default: return defaultValue;
        }
      });

      const mockResponse = { validators: [], total: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/validators?subnet_id=1&active_only=true&limit=50&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('setWeights', () => {
    it('should set validator weights successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        switch (param) {
          case 'operation': return 'setWeights';
          case 'hotkey': return 'test-hotkey';
          case 'weights': return '{"node1": 0.5, "node2": 0.3}';
          case 'version_key': return defaultValue !== undefined ? defaultValue : 'v1.0';
          default: return defaultValue;
        }
      });

      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.bittensor.com/v1/validators/test-hotkey/weights',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          weights: { node1: 0.5, node2: 0.3 },
          version_key: 'v1.0',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle invalid JSON weights', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'setWeights';
          case 'hotkey': return 'test-hotkey';
          case 'weights': return 'invalid-json';
          default: return '';
        }
      });

      await expect(executeValidatorsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid weights JSON');
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidator';
          case 'hotkey': return 'test-hotkey';
          default: return undefined;
        }
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeValidatorsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Network Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bittensor.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getNetworkStats', () => {
    it('should get network statistics successfully', async () => {
      const mockResponse = {
        total_subnets: 32,
        active_validators: 256,
        total_stake: '1000000000',
        network_hash_rate: '123456789',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getNetworkStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/network/stats',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle network stats error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getNetworkStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      await expect(
        executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Network error');
    });
  });

  describe('getBlock', () => {
    it('should get block information successfully', async () => {
      const mockResponse = {
        block_number: 12345,
        block_hash: '0x123abc',
        timestamp: '2023-01-01T00:00:00Z',
        transactions: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getBlock';
        if (param === 'blockNumber') return 12345;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/network/blocks/12345',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getAllBlocks', () => {
    it('should get all blocks successfully', async () => {
      const mockResponse = {
        blocks: [
          { block_number: 12345, block_hash: '0x123abc' },
          { block_number: 12344, block_hash: '0x456def' },
        ],
        total: 2,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAllBlocks';
        if (param === 'limit') return 10;
        if (param === 'offset') return 0;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/network/blocks?limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getDifficulty', () => {
    it('should get network difficulty successfully', async () => {
      const mockResponse = {
        netuid: 1,
        difficulty: 123456789,
        adjustment_interval: 100,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getDifficulty';
        if (param === 'netuid') return 1;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/network/difficulty?netuid=1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getConsensus', () => {
    it('should get consensus information successfully', async () => {
      const mockResponse = {
        netuid: 1,
        consensus: [0.8, 0.9, 0.7],
        validator_count: 64,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getConsensus';
        if (param === 'netuid') return 1;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/network/consensus?netuid=1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getEmission', () => {
    it('should get emission rates successfully', async () => {
      const mockResponse = {
        netuid: 1,
        emission_rate: '1000000',
        total_emission: '500000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getEmission';
        if (param === 'netuid') return 1;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bittensor.com/v1/network/emission?netuid=1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});
});
