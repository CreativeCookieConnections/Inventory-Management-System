/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: ims-server/routes/inventoryItems/index.js
 * Description: File for testing creating inventory items in the database Sprint 1 Week 6
 */

const request = require('supertest');
const app = require('../../../src/app');
const { InventoryItem } = require('../../../src/models/inventory-item.js');


// Mock the InventoryItem model to isolate the route handler from the database.
// InventoryItem is used both as a constructor (`new InventoryItem(...)` in the
// POST tests below) and as a static (`InventoryItem.findById(...)` in the GET
// tests), so the mock needs to support both call shapes.
jest.mock('../../../src/models/inventory-item.js', () => ({
    InventoryItem: Object.assign(jest.fn(), { findById: jest.fn() })
}));

describe('POST /api/inventory-items', () => {
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
        .post('/api/inventory-items')
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
        .post('/api/inventory-items')
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
        .post('/api/inventory-items')
        .send(validPayload);

        expect(response.status).toBe(500);
        expect(response.body.type).toBe('error');
        expect(response.body.message).toBe('Database write failed');
    });
});




/**
 * Author: Shannon Kueneke
 * Date: 07/09/2026
 * File: ims-server/test/routes/inventoryItems/getById.spec.ts
 * Description: Unit tests for GET /api/inventory-items/:id — reading a
 * single inventory item by ID.
 * The InventoryItem model is mocked so these run as true unit tests
 * against the route/controller logic, without a live MongoDB connection.
 */

describe('GET /api/inventory-items/:id', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: happy path — a well-formed id that matches a stored document
    it('returns 200 and the matching inventory item when the id exists', async () => {
        const mockItem = {
            _id: '650c1f1e1c9d440000a1b1c1',
            categoryId: 1000,
            supplierId: 1,
            name: 'Laptop',
            description: 'High-end gaming laptop',
            quantity: 10,
            price: 1500,
            dateCreated: '2021-01-01T00:00:00.000Z',
            dateModified: '2021-01-01T00:00:00.000Z',
        };

        InventoryItem.findById.mockResolvedValue(mockItem);

        const response = await request(app).get(
            '/api/inventory-items/650c1f1e1c9d440000a1b1c1'
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockItem);
        expect(InventoryItem.findById).toHaveBeenCalledWith(
            '650c1f1e1c9d440000a1b1c1'
        );
    });

    // Test 2: well-formed ObjectId, but no document exists with that id
    it('returns 404 when no inventory item matches a well-formed id', async () => {
        InventoryItem.findById.mockResolvedValue(null);

        const response = await request(app).get(
            '/api/inventory-items/650c1f1e1c9d440000a1b1c9'
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Inventory item not found');
    });

    // Test 3: malformed id (US-04 Task T2) — Mongoose raises a CastError,
    // which the route should translate into a 404 rather than a 500
    it('returns 404, not 500, when :id is not a validly formatted ObjectId', async () => {
        const castError = new Error('Cast to ObjectId failed');
        castError.name = 'CastError';
        InventoryItem.findById.mockRejectedValue(castError);

        const response = await request(app).get(
            '/api/inventory-items/not-a-valid-id'
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Inventory item not found');
    });
});
