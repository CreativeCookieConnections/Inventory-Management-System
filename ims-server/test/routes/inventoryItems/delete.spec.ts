/**
 * Author: Shannon Kueneke
 * Date: 07/14/2026
 * File: ims-server/test/routes/inventoryItems/delete.spec.ts
 * Description: Unit tests for DELETE /api/inventory-items/:id — removing
 * a single inventory item by ID.
 * The InventoryItem model is mocked so these run as true unit tests
 * against the route/controller logic, without a live MongoDB connection.
 */

const request = require('supertest');
const app = require('../../../src/app');
const { InventoryItem } = require('../../../src/models/inventory-item');

// Replace the real Mongoose model with an auto-mock for this test file.
jest.mock('../../../src/models/inventory-item');

describe('DELETE /api/inventory-items/:id', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: happy path — a well-formed id that matches a stored document
    it('returns 200 and deletes the matching inventory item when the id exists', async () => {
        const deletedItem = {
            _id: '650c1f1e1c9d440000a1b1c1',
            categoryId: 1000,
            supplierId: 1,
            name: 'Laptop',
            description: 'High-end gaming laptop',
            quantity: 10,
            price: 1500,
        };

        InventoryItem.findByIdAndDelete.mockResolvedValue(deletedItem);

        const response = await request(app).delete(
            '/api/inventory-items/650c1f1e1c9d440000a1b1c1'
        );

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Inventory item deleted successfully');
        expect(response.body.item).toEqual(deletedItem);
        expect(InventoryItem.findByIdAndDelete).toHaveBeenCalledWith(
            '650c1f1e1c9d440000a1b1c1'
        );
    });

    // Test 2: well-formed ObjectId, but no document exists with that id
    it('returns 404 when no inventory item matches a well-formed id', async () => {
        InventoryItem.findByIdAndDelete.mockResolvedValue(null);

        const response = await request(app).delete(
            '/api/inventory-items/650c1f1e1c9d440000a1b1c9'
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Inventory item not found');
    });

    // Test 3: malformed id — Mongoose raises a CastError, which the route
    // should translate into a 404 rather than a 500
    it('returns 404, not 500, when :id is not a validly formatted ObjectId', async () => {
        const castError = new Error('Cast to ObjectId failed');
        castError.name = 'CastError';
        InventoryItem.findByIdAndDelete.mockRejectedValue(castError);

        const response = await request(app).delete(
            '/api/inventory-items/not-a-valid-id'
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Inventory item not found');
    });
});
