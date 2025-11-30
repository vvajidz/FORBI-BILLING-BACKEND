const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        costPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    invoiceNumber: {
        type: String,
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Purchase', purchaseSchema);
