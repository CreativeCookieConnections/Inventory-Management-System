/**
 * Author: Nicholas Skelton
 * Date: 07/10/2026
 * File: inventory-items.spec.js
 * Description: Unit tests for the GET /api/inventory-items endpoint.
 * The Mongoose model is mocked so these tests don't require a live
 * MongoDB connection.
 */

const request = require('supertest');
const express = require('express');

jest.mock('../../../src/models/inventory-item');
const { InventoryItem } = require('../../../src/models/inventory-item');

const inventoryItemsRouter = require('../../../src/routes/inventoryItems');

// Minimal isolated app — mounts only the router under test, avoiding the
// need to import the full app.js (which opens a real Mongo connection).
const app = express();
app.use(express.json());
app.use('/api/inventory-items', inventoryItemsRouter);

describe('GET /api/inventory-items', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and an array of inventory items', async () => {
    const mockItems = [
      { _id: '1', name: 'Laptop', quantity: 10, price: 1500 },
      { _id: '2', name: 'Wireless Mouse', quantity: 50, price: 25.99 }
    ];
    InventoryItem.find.mockResolvedValue(mockItems);

    const res = await request(app).get('/api/inventory-items');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItems);
    expect(InventoryItem.find).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no items exist', async () => {
    InventoryItem.find.mockResolvedValue([]);

    const res = await request(app).get('/api/inventory-items');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should pass errors to the error handler when the database call fails', async () => {
    InventoryItem.find.mockRejectedValue(new Error('DB connection failed'));

    const res = await request(app).get('/api/inventory-items');

    // No custom error-handling middleware mounted in this isolated app,
    // so Express's default error handler returns 500.
    expect(res.status).toBe(500);
    expect(InventoryItem.find).toHaveBeenCalledTimes(1);
  });
});