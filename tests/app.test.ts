import request from 'supertest';

import app from '../src/app';

describe('GET /', () => {
  it('returns the API greeting', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Hello Inventory API');
  });
});

describe('GET /api/v1', () => {
  it('returns the API status', async () => {
    const response = await request(app).get('/api/v1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        name: 'Inventory API',
        version: 'v1',
        status: 'ok',
      },
    });
  });
});

describe('unknown routes', () => {
  it('returns a consistent not found error', async () => {
    const response = await request(app).get('/api/v1/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route GET /api/v1/unknown not found',
      },
    });
  });
});
