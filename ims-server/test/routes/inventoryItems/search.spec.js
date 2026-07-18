/**
 * Author: Nicholas Skelton
 * Date: 07/16/2026
 * File: ims-server/test/routes/inventoryItems/search.spec.js
 * Description: Unit tests for GET /api/inventory-items/search.
 */

const request = require('supertest');
const app = require('../../../src/app');
const { InventoryItem } = require('../../../src/models/inventory-item');

// Replace the real Mongoose model with an auto-mock for this test file.
jest.mock('../../../src/models/inventory-item');

describe('GET /api/inventory-items/search', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: happy path — a name search that matches a stored document
    it('returns 200 and the matching items for a valid name search', async () => {
        const mockItems = [
            {
                _id: '650c1f1e1c9d440000a1b1c1',
                categoryId: 1000,
                supplierId: 1,
                name: 'Mechanical Keyboard',
                description: 'RGB mechanical keyboard',
                quantity: 5,
                price: 49.99
            }
        ];

        InventoryItem.find.mockResolvedValue(mockItems);

        const response = await request(app).get(
            '/api/inventory-items/search?name=keyboard'
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockItems);
        expect(InventoryItem.find).toHaveBeenCalledWith(
            expect.objectContaining({
                name: { $regex: 'keyboard', $options: 'i' }
            })
        );
    });

    // Test 2: well-formed search, but no document matches — should be a valid empty result, not an error
    it('returns 200 with an empty array when nothing matches', async () => {
        InventoryItem.find.mockResolvedValue([]);

        const response = await request(app).get(
            '/api/inventory-items/search?name=nonexistent'
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    // Test 3: malformed numeric query param — should 400 before ever touching the database
    it('returns 400 when categoryId is not a number', async () => {
        const response = await request(app).get(
            '/api/inventory-items/search?categoryId=abc'
        );

        expect(response.status).toBe(400);
        expect(InventoryItem.find).not.toHaveBeenCalled();
    });
});