import request from 'supertest';
import app from '../src/app';

describe('Categories API', () => {
  it('returns a list of categories', async () => {
    const response = await request(app).get('/api/v1/categories');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('creates a category', async () => {
    const categoryName = `Testing Category ${Date.now()}`;
    const response = await request(app)
      .post('/api/v1/categories')
      .send({ name: categoryName });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(categoryName);
  });
});
