const express = require('express');
const request = require('supertest');

const asyncHandler = require('./asyncHandler');
const errorHandler = require('./errorHandler');
const { AppError } = require('../lib/errors');

function createApp(handler) {
  const app = express();
  app.get('/failure', asyncHandler(handler));
  app.get('/success', (req, res) => res.json({ ok: true }));
  app.use(errorHandler);
  return app;
}

describe('terminal HTTP error handling', () => {
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  test('returns a safe fallback and continues serving requests', async () => {
    const app = createApp(async () => { throw new Error('private stack detail'); });

    const failure = await request(app).get('/failure');
    const success = await request(app).get('/success');

    expect(failure.status).toBe(500);
    expect(failure.body).toEqual({ message: 'Internal server error' });
    expect(JSON.stringify(failure.body)).not.toContain('private stack detail');
    expect(success.status).toBe(200);
  });

  test('preserves safe operational status and message', async () => {
    const app = createApp(async () => {
      throw new AppError('Dependency unavailable', 502);
    });

    const response = await request(app).get('/failure');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ message: 'Dependency unavailable' });
  });

  test('delegates when headers were already sent', () => {
    const error = new Error('failure');
    const next = jest.fn();
    const req = { method: 'GET', path: '/partial' };
    const res = { headersSent: true };

    errorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
