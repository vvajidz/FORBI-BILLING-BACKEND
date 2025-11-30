const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    permissions: {
        dashboard: { type: Boolean, default: false },
        billing: { type: Boolean, default: false },
        invoices: { type: Boolean, default: false },
        purchases: { type: Boolean, default: false },
        products: { type: Boolean, default: false },
        inventory: { type: Boolean, default: false },
        customers: { type: Boolean, default: false },
        suppliers: { type: Boolean, default: false },
        employees: { type: Boolean, default: false },
        expenses: { type: Boolean, default: false },
        payments: { type: Boolean, default: false },
        reports: { type: Boolean, default: false },
        settings: { type: Boolean, default: false }
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
