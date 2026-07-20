/**
 * Author: Shannon Kueneke
 * Date: 07/20/2026
 * File: ims-server/test/routes/suppliers/index.spec.ts
 * Description: Unit tests for GET /api/suppliers/:id — reading a single
 * supplier by its business supplierId (not MongoDB's internal _id).
 * The Supplier model is mocked so these run as true unit tests against the
 * route/controller logic, without a live MongoDB connection.
 */

const request = require('supertest');
const app = require('../../../src/app');
const { Supplier } = require('../../../src/models/supplier');

// Replace the real Mongoose model with an auto-mock for this test file.
jest.mock('../../../src/models/supplier');

describe('GET /api/suppliers/:id', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: happy path — a numeric supplierId that matches a stored document
    it('returns 200 and the matching supplier when the supplierId exists', async () => {
        const mockSupplier = {
            _id: '650c1f1e1c9d440000a1b1c1',
            supplierId: 1,
            supplierName: 'Acme Supplies',
            contactInformation: 'acme@example.com',
            address: '123 Main St',
            dateCreated: '2021-01-01T00:00:00.000Z',
            dateModified: '2021-01-01T00:00:00.000Z',
        };

        Supplier.findOne.mockResolvedValue(mockSupplier);

        const response = await request(app).get('/api/suppliers/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSupplier);
        expect(Supplier.findOne).toHaveBeenCalledWith({ supplierId: 1 });
    });

    // Test 2: well-formed numeric id, but no document exists with that supplierId
    it('returns 404 when no supplier matches a well-formed numeric id', async () => {
        Supplier.findOne.mockResolvedValue(null);

        const response = await request(app).get('/api/suppliers/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Supplier not found');
    });

    // Test 3: non-numeric id — should 400 before ever touching the database
    it('returns 400 when :id is not a number', async () => {
        const response = await request(app).get('/api/suppliers/not-a-number');

        expect(response.status).toBe(400);
        expect(Supplier.findOne).not.toHaveBeenCalled();
    });
});
