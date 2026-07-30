import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    const email = `user-${Date.now()}@example.com`;

    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'secret123', name: 'Test User' });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data).toHaveProperty('token');

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'secret123' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data).toHaveProperty('token');
  });

  it('rejects access to admin route without a valid token', async () => {
    const response = await request(app).get('/api/v1/admin');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
