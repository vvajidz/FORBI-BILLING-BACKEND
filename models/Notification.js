const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['low_stock', 'new_order', 'payment', 'system', 'info'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    relatedId: {
        type: String, // Can be product ID, order ID, etc.
    },
    relatedType: {
        type: String, // 'product', 'invoice', 'purchase', etc.
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
