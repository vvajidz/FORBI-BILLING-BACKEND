const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    barcode: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
        default: 0,
    },
    minStock: {
        type: Number,
        default: 10,
    },
    location: {
        type: String,
        default: 'Store',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
