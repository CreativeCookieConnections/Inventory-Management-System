/**
 * File: category.js
 * Description: Mongoose schema and model for the categories collection.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
  categoryId: {
    type: Number,
    required: [true, 'Category ID is required'],
    unique: true
  },
  categoryName: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [250, 'Description cannot exceed 250 characters']
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
categorySchema.pre('save', function (next) {
  if (!this.isNew) {
    this.dateModified = new Date();
  }
  next();
});

module.exports = {
  Category: mongoose.model('Category', categorySchema)
};