const request = require('supertest');

const app = require('../app');
const readiness = require('../lib/readiness');

describe('health endpoint', () => {
  afterEach(() => readiness.markUnready());

  test('reports unready during startup or shutdown', async () => {
    readiness.markUnready();

    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'unready' });
  });

  test('reports ready after startup completes', async () => {
    readiness.markReady();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ready' });
  });
});
