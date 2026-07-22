/**
 * Author: Aisha Keller
 * Date: 07/22/2026
 * File: ims-server/test/routes/suppliers/supplier-create.spec.ts
 * Description: Unit tests for POST /api/suppliers — creating a new supplier.
 */

const request = require('supertest');
const app = require('../../../src/app');
const { Supplier } = require('../../../src/models/supplier');

jest.mock('../../../src/models/supplier');

describe('POST /api/suppliers', () => {
	const validPayload = {
		supplierId: 10,
		supplierName: 'Acme Supplies',
		contactInformation: 'acme@example.com',
		address: '123 Main St'
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

    // Test for successful creation of a supplier with valid payload | Sprint 3 | Week 3

	it('returns 201 and created supplier for valid payload', async () => {
		const savedSupplier = { _id: 'abc123', ...validPayload };

		Supplier.mockImplementation(() => ({
			save: jest.fn().mockResolvedValue(savedSupplier)
		}));

		const response = await request(app)
			.post('/api/suppliers')
			.send(validPayload);

		expect(response.status).toBe(201);
		expect(response.body.message).toBe('Supplier created successfully');
		expect(response.body.supplier).toMatchObject(validPayload);
		expect(Supplier).toHaveBeenCalledWith(expect.objectContaining(validPayload));
	});

    // Test for invalid payload that does not meet schema requirements | Sprint 3 | Week 3

	it('returns 400 for invalid payload and does not call Supplier model', async () => {
		const invalidPayload = {
			supplierId: 10,
			contactInformation: 'acme@example.com'
		};

		const response = await request(app)
			.post('/api/suppliers')
			.send(invalidPayload);

		expect(response.status).toBe(400);
		expect(response.body.type).toBe('error');
		expect(response.body.message).toMatch(/required property/i);
		expect(Supplier).not.toHaveBeenCalled();
	});

    // Test for database save error when creating a supplier | Sprint 3 | Week 3

	it('returns 500 when save throws', async () => {
		Supplier.mockImplementation(() => ({
			save: jest.fn().mockRejectedValue(new Error('Database write failed'))
		}));

		const response = await request(app)
			.post('/api/suppliers')
			.send(validPayload);

		expect(response.status).toBe(500);
		expect(response.body.type).toBe('error');
		expect(response.body.message).toBe('Database write failed');
	});
});