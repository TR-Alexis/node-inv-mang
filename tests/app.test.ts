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
