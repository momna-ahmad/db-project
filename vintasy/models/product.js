// models/product.js

const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Path to product image
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['in stock', 'sold'], default: 'in stock' },
    description: { type: String }
});

// Export the Product Model
module.exports = mongoose.model("Product", productSchema);
