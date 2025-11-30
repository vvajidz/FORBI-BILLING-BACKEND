const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
    },
    totalPurchased: {
        type: Number,
        default: 0,
    },
    outstanding: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Supplier', supplierSchema);
