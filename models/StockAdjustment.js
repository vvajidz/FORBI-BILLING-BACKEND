const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    type: {
        type: String,
        enum: ['add', 'remove', 'set'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);
