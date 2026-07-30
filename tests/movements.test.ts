import request from 'supertest';
import app from '../src/app';

describe('Stock movements API', () => {
  it('creates an IN movement and updates product quantity', async () => {
    const productResponse = await request(app)
      .post('/api/v1/products')
      .send({
        name: `Movement Product ${Date.now()}`,
        sku: `MOV-${Date.now()}`,
        quantity: 0,
      });

    const productId = productResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/products/${productId}/movements`)
      .send({
        type: 'IN',
        quantity: 4,
        note: 'Initial restock',
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.type).toBe('IN');
    expect(response.body.data.quantity).toBe(4);
  });

  it('rejects an OUT movement when stock is insufficient', async () => {
    const productResponse = await request(app)
      .post('/api/v1/products')
      .send({
        name: `Low Stock Product ${Date.now()}`,
        sku: `LOW-${Date.now()}`,
        quantity: 1,
      });

    const productId = productResponse.body.data.id;

    const response = await request(app)
      .post(`/api/v1/products/${productId}/movements`)
      .send({
        type: 'OUT',
        quantity: 2,
        note: 'Insufficient stock',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INSUFFICIENT_STOCK');
  });
});
