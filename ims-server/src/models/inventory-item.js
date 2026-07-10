/**
 * File: inventory-item.js
 * Description: Mongoose schema and model for the inventoryItems collection.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let inventoryItemSchema = new Schema({
  categoryId: {
    type: Number,
    required: [true, 'Category ID is required']
  },
  supplierId: {
    type: Number,
    required: [true, 'Supplier ID is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    unique: true,
    minlength: [2, 'Item name must be at least 2 characters'],
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [250, 'Description cannot exceed 250 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateModified: {
    type: Date,
    default: Date.now
  }
});

// Keep dateModified current whenever an existing document is updated
inventoryItemSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.dateModified = new Date();
  }
  next();
});

module.exports = {
  InventoryItem: mongoose.model('InventoryItem', inventoryItemSchema, 'inventoryItems')
};