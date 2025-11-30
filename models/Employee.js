const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        default: 'General',
    },
    role: {
        type: String,
        required: true,
    },
    salaryType: {
        type: String,
        enum: ['Monthly', 'Hourly', 'Contract'],
        default: 'Monthly',
    },
    salary: {
        type: Number,
        required: true,
    },
    baseSalary: {
        type: Number,
        default: 0,
    },
    ctc: {
        type: Number,
        default: 0,
    },
    salaryGrade: {
        type: String,
        default: '',
    },
    joiningDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);
