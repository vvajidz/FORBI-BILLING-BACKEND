const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
});

const invoiceSchema = new mongoose.Schema({
    invoiceNo: {
        type: String,
        required: true,
        unique: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    customerName: { // Snapshot in case customer is deleted or for quick access
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    items: [invoiceItemSchema],
    subtotal: {
        type: Number,
        required: true,
    },
    totalTax: {
        type: Number,
        required: true,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ['cash', 'card', 'upi', 'split'],
        default: 'cash',
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    balance: {
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

module.exports = mongoose.model('Invoice', invoiceSchema);
