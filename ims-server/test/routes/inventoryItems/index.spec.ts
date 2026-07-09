/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: ims-server/routes/inventoryItems/index.js
 * Description: File for testing creating inventory items in the database Sprint 1 Week 6
 */

const request = require('supertest');
const app = require('../../../src/app');
const { InventoryItem } = require('../../../src/models/inventory-item.js');


// Mock the InventoryItem model to isolate the route handler from the database
jest.mock('../../../src/models/inventory-item.js', () => ({
    InventoryItem: jest.fn()
}));

describe('POST /api/inventoryItems', () => {
    const validPayload = {
        categoryId: 1,
        supplierId: 2,
        name: 'USB-C Cable',
        description: 'Braided cable',
        quantity: 25,
        price: 14.99
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Unit Test 1 Sprint 1: Test case for successful creation of an inventory item
    it('should create an inventory item and return 201 status', async () => {
        const savedItem = {_id: 'abc123', ...validPayload };

        InventoryItem.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(savedItem)
        }));

        const response = await request(app)
        .post('/api/inventoryItems')
        .send(validPayload);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Inventory item created successfully');
        expect(response.body.item).toMatchObject(validPayload);
        expect(InventoryItem).toHaveBeenCalledWith(expect.objectContaining(validPayload));
    });

    // Unit Test 2 Sprint 1: Test case for invalid payload
    it('should return 400 for invalid payload', async () => {
        const invalidPayload = {
            categoryId: 1,
            supplierId: 2,
            description: 'Missing name',
            quantity: -1,
            price: 10
        };

        const response = await request(app)
        .post('/api/inventoryItems')
        .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body.type).toBe('error');
        expect(response.body.message).toMatch(/required property|must be >= 0/i);
        expect(InventoryItem).not.toHaveBeenCalled();
    });

    // Unit Test 3 Sprint 1: Test case for database error during save
    it('should return 500 when save throws an error', async () => {
        InventoryItem.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Database write failed'))
        }));

        const response = await request(app)
        .post('/api/inventoryItems')
        .send(validPayload);

        expect(response.status).toBe(500);
        expect(response.body.type).toBe('error');
        expect(response.body.message).toBe('Database write failed');
    });
});




