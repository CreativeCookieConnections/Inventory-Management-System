/**
 * File: supplier.js
 * Description: Mongoose schema and model for the suppliers collection.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let supplierSchema = new Schema({
  supplierId: {
    type: Number,
    required: [true, 'Supplier ID is required'],
    unique: true
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required'],
    unique: true,
    minlength: [2, 'Supplier name must be at least 2 characters'],
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  contactInformation: {
    type: String,
    required: [true, 'Contact information is required'],
    maxlength: [100, 'Contact information cannot exceed 100 characters']
  },
  address: {
    type: String,
    maxlength: [250, 'Address cannot exceed 250 characters']
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
supplierSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.dateModified = new Date();
  }
  next();
});

module.exports = {
  Supplier: mongoose.model('Supplier', supplierSchema)
};