/**
 * Author: Nicholas Skelton
 * Date: 07/09/2026
 * File: routes/index.js
 * Description: Root API router
 */

const express = require('express');
const router = express.Router();

// Placeholder root route to confirm API is up
router.get('/', (req, res) => {
  res.json({ message: 'Inventory Management System API' });
});

const inventoryItemsRouter = require('./inventoryItems');
router.use('/inventory-items', inventoryItemsRouter);

//added in router for suppliers
const suppliersRouter = require('./suppliers');
router.use('/suppliers', suppliersRouter);

module.exports = router;