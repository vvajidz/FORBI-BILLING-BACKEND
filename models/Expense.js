const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Other'],
        default: 'Cash',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
