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
const { itemInventory } = require('../../models/itemInventory');
const { addItemInventory } = require('../../schemas/itemInventory');

const ajv = new Ajv();
const validateAddItemInventory = ajv.compile(addItemInventory);

// POST request to create an inventory item Sprint 1 Student A Week 6
router.post('/', async (req, res, next) => {
    try {
        const valid = validateAddItemInventory(req.body);

        if (!valid) {
            return next(createError(400, ajv.errorsText(validateAddItemInventory.errors)));
        }

        const newItemInventory = new itemInventory(req.body);
        await newItemInventory.save();

        res.end({
            message: 'Inventory item created successfully',
            itemInventoryId: newItemInventory.inventoryItemId
        })
    } catch (err) {
        console.error(`Error while creating garden: ${err}`);
        next(err);
    }
});

module.exports = router;

