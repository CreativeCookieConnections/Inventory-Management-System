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

const { InventoryItem } = require('../../models/inventoryItem');
const { addInventoryItemSchema } = require('../../schemas/inventoryItemSchema');

const ajv = new Ajv();
const validateAddInventoryItem = ajv.compile(addInventoryItemSchema);

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

module.exports = router;



