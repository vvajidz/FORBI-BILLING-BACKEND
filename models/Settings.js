const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Business Settings
    creditPointsPerAmount: {
        type: Number,
        default: 100, // ₹100 = 1 credit point
    },
    businessName: {
        type: String,
        default: 'My Business',
    },
    ownerName: {
        type: String,
        default: 'Admin User',
    },
    gstNumber: {
        type: String,
        default: '',
    },
    panNumber: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    logo: {
        type: String,
        default: '',
    },

    // Invoice Settings
    invoicePrefix: {
        type: String,
        default: 'INV-',
    },
    nextInvoiceNumber: {
        type: Number,
        default: 1001,
    },
    invoiceFooterText: {
        type: String,
        default: 'Thank you for your business! Visit again.',
    },
    showLogo: {
        type: Boolean,
        default: true,
    },
    showGSTIN: {
        type: Boolean,
        default: true,
    },
    showTerms: {
        type: Boolean,
        default: true,
    },

    // Tax & Currency Settings
    defaultTaxRate: {
        type: Number,
        default: 18, // 18% GST
    },
    currency: {
        type: String,
        default: 'INR',
    },
    currencySymbol: {
        type: String,
        default: '₹',
    },
    taxType: {
        type: String,
        enum: ['inclusive', 'exclusive'],
        default: 'inclusive',
    },

    // Notification Settings
    lowStockAlert: {
        type: Boolean,
        default: true,
    },
    emailNotifications: {
        type: Boolean,
        default: false,
    },
    smsNotifications: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
