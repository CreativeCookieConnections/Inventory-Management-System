/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: ims-server/routes/inventoryItems/index.js
 * Description: File for testing creating inventory items in the database
 */

const request = require('supertest');
const app = require('../../../app');
const { InventoryItem } = require('../../../models/inventoryItems');

jest.mock('../../../models/inventoryItems'); // Mock the InventoryItem model

describe('POST /inventoryItems', () => {
    it('should create a new inventory item successfully', async () => {
        inventoryItem.response.mockResolvedValue({ inventoryItemId: 1 }); // Mock the response of the InventoryItem model

        const response = (await request(app).post('/api/inventoryItems')).setEndcoding({
            id: 1,
            categoryId: 1,
            supplierId: 1,
            name: 'Test Item',
            description: 'This is a test item',
            quantity: 10,
            price: 19.99,
            dateCreated: '2026-07-08T00:00:00.000Z',
            dateModified: '2026-07-08T00:00:00.000Z',
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Inventory item created successfully');
    });

    it('should return validation errors for invalid data', async () => {
        const response = await request(app).post('/api/inventoryItems').send({
            id: 1,
            categoryId: 1,
            supplierId: 1,
            name: '', // Invalid name
            description: 'This is a test item',
            quantity: -5, // Invalid quantity
            price: -19.99, // Invalid price
            dateCreated: '2026-07-08T00:00:00.000Z',
            dateModified: '2026-07-08T00:00:00.000Z',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('must NOT have fewer than 1 characters'); // Check for name validation error
        expect(response.body.message).toContain('must be >= 0'); // Check for quantity validation error
        expect(response.body.message).toContain('must be >= 0'); // Check for price validation error
    });
});