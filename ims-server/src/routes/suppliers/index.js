/**
 * Author: Shannon Kueneke
 * Date: 07/20/2026
 * File: ims-server/src/routes/suppliers/index.js
 * Description: API for reading suppliers.
 */

const express = require('express');
const createError = require('http-errors');
const router = express.Router();

const { Supplier } = require('../../models/supplier.js');

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

module.exports = router;
