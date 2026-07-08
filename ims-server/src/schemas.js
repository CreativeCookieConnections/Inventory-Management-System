/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: schemas.js
 * Description: Validate APIs 
 */

// Add a schema for creating an inventory item
const addInventoryItemSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' }
    },
    required: ['name']
};

module.exports = {
    addInventoryItemSchema
};