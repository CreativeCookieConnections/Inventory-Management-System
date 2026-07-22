/**
 * Author: Shannon Kueneke
 * Date: 07/20/2026
 * File: ims-server/src/routes/suppliers/index.js
 * Description: API for reading suppliers.
 */

const express = require('express');
const Ajv = require('ajv'); // JSON schema validator
const createError = require('http-errors');
const router = express.Router();

// Import the Supplier model and the schema for validating supplier data
const { Supplier } = require('../../models/supplier.js');
const { addSupplierSchema } = require('../../schemas.js');

// Initialize AJV and compile the schema for validating supplier data
const ajv = new Ajv();
const validateAddSupplier = ajv.compile(addSupplierSchema);

/**
 * GET /api/suppliers/:id
 * Sprint 3 | Shannon Kueneke
 * File: ims-server/src/routes/suppliers/index.js
 *
 * Looks up a single supplier by its business supplierId (a unique Number
 * field on the suppliers collection — see src/models/supplier.js), not by
 * MongoDB's internal _id. This is the identifier suppliers are known by
 * everywhere else in the app (e.g. inventoryItems.supplierId), so it's what
 * a caller/UI naturally has on hand. Responds 400 when :id isn't numeric,
 * and 404 (via the shared error-handler middleware) when no document
 * matches a well-formed numeric id.
 */
router.get('/:id', async (req, res, next) => {
    try {
        if (Number.isNaN(Number(req.params.id))) {
            return next(createError(400, 'Supplier id must be a number'));
        }

        const supplier = await Supplier.findOne({ supplierId: Number(req.params.id) });

        if (!supplier) {
            return next(createError(404, 'Supplier not found'));
        }

        res.status(200).json(supplier);
    } catch (err) {
        console.error(`Error while reading supplier: ${err}`);
        next(err);
    }
});

/**
 * POST /api/suppliers
 * Sprint 3 | Aisha Keller
 * File: ims-server/src/routes/suppliers/index.js
 * 
 * Creates a new supplier document in the database. Expects a JSON body with
 * the following fields:
 * - supplierId (Number, required, unique)
 * - supplierName (String, required)
 * - contactInformation (String, required)
 * - address (String, optional)
 */

// POST route for creating a new supplier Sprint 3 | Week 3
router.post('/', async (req, res, next) => {
    try {
        const valid = validateAddSupplier(req.body);
        if (!valid) {
            return next(createError(400, ajv.errorsText(validateAddSupplier.errors)));
        }
        
        const newSupplier = new Supplier({
            supplierId: req.body.supplierId,
            supplierName: req.body.supplierName,
            contactInformation: req.body.contactInformation,
            address: req.body.address
        });

        const savedSupplier = await newSupplier.save();

        res.status(201).json({
            message: 'Supplier created successfully',
            supplier: savedSupplier
        });
        } catch (err) {
            next(err);
    }
});

module.exports = router;
