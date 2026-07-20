/* eslint-disable import/first */
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

const request = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

vi.mock('axios', () => ({
  default: {
    create: () => request,
    get: vi.fn(),
  },
}));

import HttpInstance from './http';
import { normalizeHttpError } from './http-error';

describe('HttpInstance', () => {
  const http = new HttpInstance('http://test');

  beforeEach(() => vi.clearAllMocks());

  it.each([
    ['get', ['/resource']],
    ['post', ['/resource', {}]],
    ['put', ['/resource', {}]],
    ['patch', ['/resource', {}]],
    ['delete', ['/resource']],
  ])('returns data for successful %s requests', async (method, args) => {
    request[method].mockResolvedValueOnce({ data: { ok: true } });
    await expect(http[method](...args)).resolves.toEqual({ ok: true });
  });

  it('uses null for a successful response without an entity', async () => {
    request.get.mockResolvedValueOnce({ data: undefined });
    await expect(http.get('/empty')).resolves.toBeNull();
  });

  it.each([401, 404, 500])('normalizes HTTP %s failures', (status) => {
    const cause = { response: { status, data: { msg: 'Safe message' } } };
    const error = normalizeHttpError(cause);
    expect(error).toMatchObject({ status, message: 'Safe message', cause });
  });

  it('normalizes network failures without exposing internals', () => {
    const cause = { code: 'ERR_NETWORK' };
    expect(normalizeHttpError(cause)).toMatchObject({
      status: null,
      code: 'ERR_NETWORK',
      message: 'Unable to reach the server.',
    });
  });
});
