import { describe, expect, it } from 'vitest';
import { createQueryClient, shouldRetry } from './queryClient';

describe('query client', () => {
  it('creates isolated clients for tests', () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });

  it('does not retry deterministic client failures', () => {
    expect(shouldRetry(0, { status: 401 })).toBe(false);
    expect(shouldRetry(0, { status: 404 })).toBe(false);
  });

  it('bounds transient retries', () => {
    expect(shouldRetry(0, { status: 500 })).toBe(true);
    expect(shouldRetry(2, { status: 500 })).toBe(false);
  });
});
