const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
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
    totalBilling: {
        type: Number,
        default: 0,
    },
    outstanding: {
        type: Number,
        default: 0,
    },
    lastVisit: {
        type: Date,
        default: Date.now,
    },
    creditPoints: {
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

module.exports = mongoose.model('Customer', customerSchema);
