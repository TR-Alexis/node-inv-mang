import request from 'supertest';
import app from '../src/app';

describe('Products API', () => {
  it('returns a list of products', async () => {
    const response = await request(app).get('/api/v1/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('meta');
  });

  it('creates a product', async () => {
    const productData = {
      name: `Test Product ${Date.now()}`,
      sku: `TEST-SKU-${Date.now()}`,
      description: 'Product created during tests',
      quantity: 5,
    };

    const response = await request(app)
      .post('/api/v1/products')
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(productData.name);
    expect(response.body.data.sku).toBe(productData.sku);
  });
});
