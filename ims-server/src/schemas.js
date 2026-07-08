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
        itemInventoryId: { type: 'number', minimum: 1, maximum: 100 },
       categoryId: { type: 'number', minimum: 1, maximum: 100 },
       supplierId: { type: 'number', minimum: 1, maximum: 100 },
       name: { type: 'string' },
       description: { type: 'string', maxLength: 500 },
       quantity: { type: 'number', minimum: 0 },
       price: { type: 'number', minimum: 0 },
       dateCreated: { type: 'string', pattern: '^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z)?$' }, // YYYY-MM-DD format
       dateUpdated: { type: 'string', pattern: '^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z)?$' } // YYYY-MM-DD format

    },
    required: ['itemInventoryId', 'categoryId', 'supplierId', 'name', 'description', 'quantity', 'price', 'dateCreated', 'dateUpdated']
};

module.exports = {
    addInventoryItemSchema
};