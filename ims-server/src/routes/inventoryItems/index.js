/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: index.js
 * Description: API to create an inventory item.
 */

const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const router = express.Router();

const { InventoryItem } = require('../../models/inventory-item.js');
const { addInventoryItemSchema } = require('../../schemas.js');

const ajv = new Ajv();
const validateAddInventoryItem = ajv.compile(addInventoryItemSchema);

/**
 * GET /api/inventory-items
 * Returns all inventory items.
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST request to add a new item to the inventory
router.post('/', async (req, res, next) => {
    try {
        const valid = validateAddInventoryItem(req.body);

        if (!valid) {
            return next(createError(400, ajv.errorsText(validateAddInventoryItem.errors)));
        }

    const newInventoryItem = new InventoryItem({
        categoryId: req.body.categoryId,
        supplierId: req.body.supplierId,
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price
    });

    const savedItem = await newInventoryItem.save();

    res.status(201).json({
        message: 'Inventory item created successfully',
        item: savedItem
    });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/inventory-items/:id
 * Sprint 1 | Shannon Kueneke 
 * File: ims-server/src/routes/itemInventory/index.js
 *
 * Looks up a single inventory item by its MongoDB _id and returns the full
 * document as JSON. Responds 404 (via the shared error-handler middleware)
 * both when no document matches a well-formed id, and when the id itself is
 * not a valid ObjectId — satisfying US-04 Task T2 ("Implement 404 error
 * handling for invalid or non-existent item IDs").
 */
router.get('/:id', async (req, res, next) => {
    try {
        const inventoryItem = await InventoryItem.findById(req.params.id);

        if (!inventoryItem) {
            return next(createError(404, 'Inventory item not found'));
        }

        res.status(200).json(inventoryItem);
    } catch (err) {
        // Mongoose throws a CastError when :id isn't a validly-formatted
        // ObjectId (e.g. "abc123") — treat that the same as "not found"
        // rather than surfacing it as a 500 server error.
        if (err.name === 'CastError') {
            return next(createError(404, 'Inventory item not found'));
        }
        console.error(`Error while reading inventory item: ${err}`);
        next(err);
    }
});

/**
 * DELETE /api/inventory-items/:id
 * Sprint 1 | Shannon Kueneke
 * File: ims-server/src/routes/inventoryItems/index.js
 *
 * Deletes a single inventory item by its MongoDB _id. Responds 404 (via
 * the shared error-handler middleware) both when no document matches a
 * well-formed id, and when the id itself is not a valid ObjectId —
 * mirroring the GET /:id behavior above.
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return next(createError(404, 'Inventory item not found'));
        }

        res.status(200).json({
            message: 'Inventory item deleted successfully',
            item: deletedItem
        });
    } catch (err) {
        // Mongoose throws a CastError when :id isn't a validly-formatted
        // ObjectId (e.g. "abc123") — treat that the same as "not found"
        // rather than surfacing it as a 500 server error.
        if (err.name === 'CastError') {
            return next(createError(404, 'Inventory item not found'));
        }
        console.error(`Error while deleting inventory item: ${err}`);
        next(err);
    }
});

module.exports = router;



