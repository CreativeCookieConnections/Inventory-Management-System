/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: index.js
 * Description: Routing for the index page of the inventory management system.
 */

// require statements
const express = require('express');
const router = express.Router();
const iventoryItems = require('./inventoryItems');

router.get('/', function(req, res, next) {
    const appName = 'Inventory Management System';
    res.send({
        message: `Hello from the ${appName} API!`
    });
});

router.use('/itemInventory', inventoryItems);

module.exports = router;