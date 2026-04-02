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
describe('Subnet Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.bittensor.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all subnets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllSubnets')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(0);
    
    const mockResponse = { subnets: [{ id: 1, name: 'Test Subnet' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get specific subnet successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSubnet')
      .mockReturnValueOnce('123');
    
    const mockResponse = { id: 123, name: 'Test Subnet' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should register to subnet successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('registerToSubnet')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('hotkey123')
      .mockReturnValueOnce('coldkey123');
    
    const mockResponse = { success: true, transaction_id: 'tx123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubnetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSubnet');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeSubnetOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when operation is unknown', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeSubnetOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Validator Resource', () => {
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
			},
		};
	});

	describe('getAllValidators', () => {
		it('should get all validators successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllValidators')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(1);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
				validators: [{ uid: '1', hotkey: 'test-hotkey' }],
			});

			const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.bittensor.com/v1/validators',
				qs: {
					limit: 50,
					offset: 0,
					subnet_id: 1,
				},
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				validators: [{ uid: '1', hotkey: 'test-hotkey' }],
			});
		});

		it('should handle errors when getting all validators', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllValidators');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getValidator', () => {
		it('should get specific validator successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidator')
				.mockReturnValueOnce('validator-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
				uid: 'validator-123',
				hotkey: 'test-hotkey',
				performance: 95.5,
			});

			const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.bittensor.com/v1/validators/validator-123',
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result[0].json.uid).toBe('validator-123');
		});
	});

	describe('createValidator', () => {
		it('should create validator successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createValidator')
				.mockReturnValueOnce('hotkey-123')
				.mockReturnValueOnce('coldkey-456')
				.mockReturnValueOnce(1);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
				success: true,
				validator_uid: 'new-validator-123',
			});

			const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.bittensor.com/v1/validators',
				body: {
					hotkey: 'hotkey-123',
					coldkey: 'coldkey-456',
					subnet_id: 1,
				},
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result[0].json.success).toBe(true);
		});
	});

	describe('updateValidator', () => {
		it('should update validator successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateValidator')
				.mockReturnValueOnce('validator-123')
				.mockReturnValueOnce('{"setting1": "value1", "setting2": 42}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
				success: true,
				message: 'Validator updated',
			});

			const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.bittensor.com/v1/validators/validator-123',
				body: {
					config: {
						setting1: 'value1',
						setting2: 42,
					},
				},
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result[0].json.success).toBe(true);
		});

		it('should handle invalid JSON in config', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateValidator')
				.mockReturnValueOnce('validator-123')
				.mockReturnValueOnce('invalid json');

			await expect(
				executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('Invalid JSON in config');
		});
	});
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.bittensor.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('getAllStakes should retrieve all stakes', async () => {
    const mockStakes = [{ id: 'stake1', amount: '100', validator_uid: 'val1' }];
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllStakes')
      .mockReturnValueOnce('coldkey123')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(0);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockStakes);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockStakes);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bittensor.com/v1/stakes',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: {
        coldkey: 'coldkey123',
        limit: 100,
        offset: 0,
      },
      json: true,
    });
  });

  test('addStake should create new stake', async () => {
    const mockStakeResponse = { id: 'stake123', status: 'created' };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('addStake')
      .mockReturnValueOnce('validator123')
      .mockReturnValueOnce('50.5')
      .mockReturnValueOnce('coldkey123')
      .mockReturnValueOnce('hotkey123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockStakeResponse);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockStakeResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.bittensor.com/v1/stakes',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        validator_uid: 'validator123',
        amount: '50.5',
        coldkey: 'coldkey123',
        hotkey: 'hotkey123',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllStakes');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Delegation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.bittensor.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get all delegations successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllDelegations')
      .mockReturnValueOnce('5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ delegations: [] });

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bittensor.com/v1/delegations',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: {
        coldkey: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
        limit: 100,
        offset: 0,
      },
      json: true,
    });
  });

  it('should create delegation successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createDelegation')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('10.5')
      .mockReturnValueOnce('5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.bittensor.com/v1/delegations',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        validator_uid: '123',
        amount: '10.5',
        coldkey: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
      },
      json: true,
    });
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllDelegations');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllDelegations');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('Network Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bittensor.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Bittensor Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getNetworkStats operation', () => {
    it('should successfully get network statistics', async () => {
      const mockResponse = { totalNodes: 100, activeValidators: 80, networkHashrate: '1000 TH/s' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkStats');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle network stats error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkStats');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Network error');
    });
  });

  describe('getBlocks operation', () => {
    it('should successfully get blocks with limit and offset', async () => {
      const mockResponse = { blocks: [{ number: 100, hash: 'abc123' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocks')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle blocks retrieval error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocks')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Blocks error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Blocks error');
    });
  });

  describe('getBlock operation', () => {
    it('should successfully get specific block', async () => {
      const mockResponse = { number: 100, hash: 'abc123', transactions: [] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce(100);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle block retrieval error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce(100);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Block not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Block not found');
    });
  });

  describe('getDifficulty operation', () => {
    it('should successfully get network difficulty', async () => {
      const mockResponse = { difficulty: '1000000', adjustmentTime: '2024-01-01T00:00:00Z' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getDifficulty');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle difficulty retrieval error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getDifficulty');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Difficulty error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Difficulty error');
    });
  });

  describe('getTotalIssuance operation', () => {
    it('should successfully get total issuance', async () => {
      const mockResponse = { totalIssuance: '1000000 TAO', lastUpdate: '2024-01-01T00:00:00Z' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTotalIssuance');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle total issuance error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTotalIssuance');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Issuance error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Issuance error');
    });
  });

  describe('getTempo operation', () => {
    it('should successfully get tempo information', async () => {
      const mockResponse = { tempo: 100, blockTime: '12s', epochLength: 360 };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTempo');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle tempo retrieval error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTempo');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Tempo error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Tempo error');
    });
  });
});
});
