/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  normalizeWeights,
  percentagesToWeights,
  validateWeights,
  sortWeightsByUid,
  filterZeroWeights,
  getTopWeights,
  prepareWeightsForSubmission,
} from '../../nodes/Bittensor/utils/weightUtils';

describe('Weight Utils', () => {
  describe('normalizeWeights', () => {
    it('should normalize weights to sum to max weight', () => {
      const weights = [
        { uid: 0, weight: 50 },
        { uid: 1, weight: 50 },
      ];
      const normalized = normalizeWeights(weights);
      const total = normalized.reduce((sum, w) => sum + w.weight, 0);
      expect(total).toBeCloseTo(65535, -2);
    });

    it('should handle empty weights', () => {
      expect(normalizeWeights([])).toEqual([]);
    });

    it('should handle zero total weight', () => {
      const weights = [{ uid: 0, weight: 0 }];
      expect(normalizeWeights(weights)).toEqual(weights);
    });
  });

  describe('percentagesToWeights', () => {
    it('should convert percentages to weights', () => {
      const percentages = [
        { uid: 0, percentage: 50 },
        { uid: 1, percentage: 50 },
      ];
      const weights = percentagesToWeights(percentages);
      expect(weights[0].weight).toBe(32767);
      expect(weights[1].weight).toBe(32767);
    });
  });

  describe('validateWeights', () => {
    it('should validate valid weights', () => {
      const weights = [
        { uid: 0, weight: 1000 },
        { uid: 1, weight: 2000 },
      ];
      const result = validateWeights(weights, 1, 65535);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject insufficient weights', () => {
      const weights = [{ uid: 0, weight: 1000 }];
      const result = validateWeights(weights, 5, 65535);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject weights over limit', () => {
      const weights = [{ uid: 0, weight: 100000 }];
      const result = validateWeights(weights, 1, 65535);
      expect(result.valid).toBe(false);
    });

    it('should reject duplicate UIDs', () => {
      const weights = [
        { uid: 0, weight: 1000 },
        { uid: 0, weight: 2000 },
      ];
      const result = validateWeights(weights, 1, 65535);
      expect(result.valid).toBe(false);
    });

    it('should reject negative weights', () => {
      const weights = [{ uid: 0, weight: -1000 }];
      const result = validateWeights(weights, 1, 65535);
      expect(result.valid).toBe(false);
    });
  });

  describe('sortWeightsByUid', () => {
    it('should sort weights by UID', () => {
      const weights = [
        { uid: 3, weight: 100 },
        { uid: 1, weight: 200 },
        { uid: 2, weight: 300 },
      ];
      const sorted = sortWeightsByUid(weights);
      expect(sorted.map(w => w.uid)).toEqual([1, 2, 3]);
    });
  });

  describe('filterZeroWeights', () => {
    it('should filter out zero weights', () => {
      const weights = [
        { uid: 0, weight: 100 },
        { uid: 1, weight: 0 },
        { uid: 2, weight: 200 },
      ];
      const filtered = filterZeroWeights(weights);
      expect(filtered).toHaveLength(2);
      expect(filtered.find(w => w.uid === 1)).toBeUndefined();
    });
  });

  describe('getTopWeights', () => {
    it('should return top N weights', () => {
      const weights = [
        { uid: 0, weight: 100 },
        { uid: 1, weight: 300 },
        { uid: 2, weight: 200 },
      ];
      const top = getTopWeights(weights, 2);
      expect(top).toHaveLength(2);
      expect(top[0].weight).toBe(300);
      expect(top[1].weight).toBe(200);
    });
  });

  describe('prepareWeightsForSubmission', () => {
    it('should prepare weights for chain submission', () => {
      const weights = [
        { uid: 2, weight: 100 },
        { uid: 0, weight: 0 },
        { uid: 1, weight: 200 },
      ];
      const prepared = prepareWeightsForSubmission(weights);
      expect(prepared.uids).toEqual([1, 2]);
      expect(prepared.values).toEqual([200, 100]);
    });
  });
});
