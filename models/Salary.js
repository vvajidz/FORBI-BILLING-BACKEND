const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    month: {
        type: String,
        required: true, // Format: "2024-12"
    },
    year: {
        type: Number,
        required: true,
    },
    baseSalary: {
        type: Number,
        required: true,
    },
    allowances: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Processing'],
        default: 'Pending',
    },
    paymentDate: {
        type: Date,
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Cheque', 'UPI'],
        default: 'Bank Transfer',
    },
    notes: {
        type: String,
        default: '',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for faster queries
salarySchema.index({ employee: 1, month: 1, year: 1 });

module.exports = mongoose.model('Salary', salarySchema);
