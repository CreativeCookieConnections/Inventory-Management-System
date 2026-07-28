/**
 * Author: Aisha Keller
 * Date: 07/28/2026
 * File: ims-server/test/routes/suppliers/supplier-update.spec.ts
 * Description: Unit tests for PUT /api/suppliers/:id — updating a
 * supplier by its business supplierId (not MongoDB's internal _id).
 */

const request = require('supertest');
const app = require('../../../src/app');
const { Supplier } = require('../../../src/models/supplier');

// Mock the Supplier model so tests run without a live database
jest.mock('../../../src/models/supplier');

describe('PUT /api/suppliers/:id', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test 1: happy path — numeric supplierId exists and is updated Sprint 4 | Week 4
  it('returns 200 and the updated supplier when the supplierId exists', async () => {
    const payload = {
      supplierName: 'Acme Supplies Updated',
      contactInformation: 'updated@example.com',
      address: '999 Updated St'
    };

    const updatedSupplier = {
      _id: '650c1f1e1c9d440000a1b1c1',
      supplierId: 1,
      ...payload
    };

    Supplier.findOneAndUpdate.mockResolvedValue(updatedSupplier);

    const response = await request(app)
      .put('/api/suppliers/1')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Supplier updated successfully');
    expect(response.body.supplier).toEqual(updatedSupplier);

    expect(Supplier.findOneAndUpdate).toHaveBeenCalledWith(
      { supplierId: 1 },
      payload,
      { new: true, runValidators: true }
    );
  });

  // Test 2: numeric supplierId is valid, but no supplier found Sprint 4 | Week 4
  it('returns 404 when no supplier matches a well-formed numeric id', async () => {
    const payload = {
      supplierName: 'Does Not Matter',
      contactInformation: 'none@example.com',
      address: 'No Address'
    };

    Supplier.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/suppliers/999')
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Supplier not found');
  });

  // Test 3: non-numeric route id — should 400 before hitting DB Sprint 4 | Week 4
  it('returns 400 when :id is not a number', async () => {
    const payload = {
      supplierName: 'Acme Supplies Updated',
      contactInformation: 'updated@example.com',
      address: '999 Updated St'
    };

    const response = await request(app)
      .put('/api/suppliers/not-a-number')
      .send(payload);

    expect(response.status).toBe(400);
    expect(Supplier.findOneAndUpdate).not.toHaveBeenCalled();
  });
});