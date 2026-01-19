/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  raoToTao,
  taoToRao,
  formatTao,
  formatRao,
  parseAmount,
  calculateStakePercentage,
  weightToPercentage,
  percentageToWeight,
  takeToPercentage,
  toBalanceOutput,
} from '../../nodes/Bittensor/utils/unitConverter';

describe('Unit Converter', () => {
  describe('raoToTao', () => {
    it('should convert RAO to TAO correctly', () => {
      expect(raoToTao(BigInt(1_000_000_000))).toBe(1);
      expect(raoToTao(BigInt(500_000_000))).toBe(0.5);
      expect(raoToTao(BigInt(0))).toBe(0);
    });

    it('should handle string input', () => {
      expect(raoToTao('1000000000')).toBe(1);
    });

    it('should handle number input', () => {
      expect(raoToTao(1000000000)).toBe(1);
    });
  });

  describe('taoToRao', () => {
    it('should convert TAO to RAO correctly', () => {
      expect(taoToRao(1)).toBe(BigInt(1_000_000_000));
      expect(taoToRao(0.5)).toBe(BigInt(500_000_000));
      expect(taoToRao(0)).toBe(BigInt(0));
    });

    it('should handle string input', () => {
      expect(taoToRao('1')).toBe(BigInt(1_000_000_000));
    });
  });

  describe('formatTao', () => {
    it('should format TAO amount with symbol', () => {
      expect(formatTao(BigInt(1_000_000_000))).toBe('1.0000 τ');
      expect(formatTao(BigInt(500_000_000), 2)).toBe('0.50 τ');
    });
  });

  describe('formatRao', () => {
    it('should format RAO amount', () => {
      expect(formatRao(BigInt(1_000_000_000))).toContain('RAO');
    });
  });

  describe('parseAmount', () => {
    it('should parse TAO amount to RAO', () => {
      expect(parseAmount('1', 'tao')).toBe(BigInt(1_000_000_000));
    });

    it('should parse RAO amount', () => {
      expect(parseAmount('1000000000', 'rao')).toBe(BigInt(1_000_000_000));
    });
  });

  describe('calculateStakePercentage', () => {
    it('should calculate stake percentage', () => {
      expect(calculateStakePercentage(BigInt(100), BigInt(1000))).toBe(10);
      expect(calculateStakePercentage(BigInt(0), BigInt(1000))).toBe(0);
    });

    it('should return 0 for zero total stake', () => {
      expect(calculateStakePercentage(BigInt(100), BigInt(0))).toBe(0);
    });
  });

  describe('weightToPercentage', () => {
    it('should convert weight to percentage', () => {
      expect(weightToPercentage(65535)).toBe(100);
      expect(weightToPercentage(32767.5)).toBeCloseTo(50, 1);
      expect(weightToPercentage(0)).toBe(0);
    });
  });

  describe('percentageToWeight', () => {
    it('should convert percentage to weight', () => {
      expect(percentageToWeight(100)).toBe(65535);
      expect(percentageToWeight(50)).toBe(32767);
      expect(percentageToWeight(0)).toBe(0);
    });
  });

  describe('takeToPercentage', () => {
    it('should convert take rate to percentage', () => {
      expect(takeToPercentage(65535)).toBe(100);
      expect(takeToPercentage(6553.5)).toBeCloseTo(10, 1);
    });
  });

  describe('toBalanceOutput', () => {
    it('should return balance output object', () => {
      const output = toBalanceOutput(BigInt(1_000_000_000));
      expect(output.rao).toBe('1000000000');
      expect(output.tao).toBe(1);
      expect(output.formatted).toBe('1.0000 τ');
    });
  });
});
