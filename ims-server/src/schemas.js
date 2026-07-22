/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: schemas.js
 * Description: Validate APIs 
 */

// Add a validation schema for adding new Item Inventory to the Inventory Management System (IMS)
const addInventoryItemSchema = {
    type: 'object',
    properties: {
        categoryId: { type: 'number' },
        supplierId: { type: 'number' },
        name: { type: 'string', minLength: 2, maxLength: 100 },
        description: { type: 'string', maxLength: 250 },
        quantity: { type: 'number', minimum: 0 },
        price: { type: 'number', minimum: 0 },

    },
    required: ['categoryId', 'supplierId', 'name', 'quantity', 'price']
};

// Add validation schema for updating an existing inventory item in the Inventory Management System (IMS)
const updateInventoryItemSchema = {
    type: 'object',
    properties: {
        categoryId: { type: 'number' },
        supplierId: { type: 'number' },
        name: { type: 'string', minLength: 2, maxLength: 100 },
        description: { type: 'string', maxLength: 250 },
        quantity: { type: 'number', minimum: 0 },
        price: { type: 'number', minimum: 0 },
    },
    required: ['categoryId', 'supplierId', 'name', 'quantity', 'price']
};

// Add validation schema for adding a new supplier in the Inventory Management System (IMS)
const addSupplierSchema = {
    type: 'object',
    properties: {
        supplierId: { type: 'number' },
        supplierName: { type: 'string', minLength: 2, maxLength: 100 },
        contactInformation: { type: 'string', maxLength: 100 },
        address: { type: 'string', maxLength: 250 }
    },
    required: ['supplierId', 'supplierName', 'contactInformation']
};


module.exports = {
    addInventoryItemSchema,
    updateInventoryItemSchema,
    addSupplierSchema
};


