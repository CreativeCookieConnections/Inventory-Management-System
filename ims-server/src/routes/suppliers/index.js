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
const { updateSupplierSchema } = require('../../schemas.js');

// Initialize AJV and compile the schema for validating supplier data
const ajv = new Ajv();
const validateAddSupplier = ajv.compile(addSupplierSchema);
const validateUpdateSupplier = ajv.compile(updateSupplierSchema);

/**
 * GET /api/suppliers
 * Sprint 3 | Nicholas Skelton
 * File: ims-server/src/routes/suppliers/index.js
 *
 * List All — returns every supplier in the collection, sorted
 * alphabetically by supplierName. Defined ahead of GET /:id and
 * GET /search so this router's static routes don't get shadowed.
 */
router.get('/', async (req, res, next) => {
    try {
        const suppliers = await Supplier.find().sort({ supplierName: 1 });
        res.status(200).json(suppliers);
    } catch (err) {
        console.error(`Error while reading suppliers: ${err}`);
        next(err);
    }
});

/**
 * GET /api/suppliers/search?name=...&supplierId=...
 * Sprint 4 | Nicholas Skelton
 * File: ims-server/src/routes/suppliers/index.js
 *
 * Search — supports two independent, optional filters that combine with
 * AND when both are given:
 * - name: case-insensitive partial match against supplierName
 * - supplierId: exact match against the numeric supplierId
 * At least one filter is required. Must stay above GET /:id below;
 * otherwise a request to /search would be caught by the :id param route
 * and rejected as a non-numeric id.
 */
router.get('/search', async (req, res, next) => {
    try {
        const { name, supplierId } = req.query;
 
        if ((!name || !name.trim()) && (supplierId === undefined || supplierId === '')) {
            return next(createError(400, 'At least one search filter (name or supplierId) is required'));
        }
 
        const conditions = [];
 
        if (name && name.trim()) {
            conditions.push({ supplierName: new RegExp(name.trim(), 'i') });
        }
 
        if (supplierId !== undefined && supplierId !== '') {
            if (Number.isNaN(Number(supplierId))) {
                return next(createError(400, 'supplierId must be a number'));
            }
            conditions.push({ supplierId: Number(supplierId) });
        }
 
        const suppliers = await Supplier.find(
            conditions.length > 1 ? { $and: conditions } : conditions[0]
        ).sort({ supplierName: 1 });
 
        res.status(200).json(suppliers);
    } catch (err) {
        console.error(`Error while searching suppliers: ${err}`);
        next(err);
    }
});

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

/**
 * DELETE /api/suppliers/:id
 * Sprint 3 | Shannon Kueneke
 * File: ims-server/src/routes/suppliers/index.js
 *
 * Deletes a single supplier by its business supplierId (not MongoDB's
 * internal _id) — mirroring the GET /:id lookup above. Responds 400 when
 * :id isn't numeric, and 404 (via the shared error-handler middleware)
 * when no document matches a well-formed numeric id.
 */
router.delete('/:id', async (req, res, next) => {
    try {
        if (Number.isNaN(Number(req.params.id))) {
            return next(createError(400, 'Supplier id must be a number'));
        }

        const deletedSupplier = await Supplier.findOneAndDelete({ supplierId: Number(req.params.id) });

        if (!deletedSupplier) {
            return next(createError(404, 'Supplier not found'));
        }

        res.status(200).json({
            message: 'Supplier deleted successfully',
            supplier: deletedSupplier
        });
    } catch (err) {
        console.error(`Error while deleting supplier: ${err}`);
        next(err);
    }
});

/**
 * PUT /api/suppliers/:id
 * Sprint 3 | Aisha Keller
 * File: ims-server/src/routes/suppliers/index.js
 * 
 * Updates an existing supplier document in the database. Expects a JSON body with
 * the following fields:
 * - supplierName (String, optional)
 * - contactInformation (String, optional)
 * - address (String, optional)
 * 
 * Responds 400 when :id isn't numeric, and 404 (via the shared error-handler middleware)
 * when no document matches a well-formed numeric id.
 */

// PUT route for updating an existing supplier Sprint 4 | Week 4
router.put('/:id', async (req, res, next) => {
  try {
    if (Number.isNaN(Number(req.params.id))) {
      return next(createError(400, 'Supplier id must be a number'));
    }

    const valid = validateUpdateSupplier(req.body);
    if (!valid) {
      return next(createError(400, ajv.errorsText(validateUpdateSupplier.errors)));
    }

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { supplierId: Number(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return next(createError(404, 'Supplier not found'));
    }

    res.status(200).json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
