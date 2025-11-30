const Notification = require('../models/Notification');
const Product = require('../models/Product');

const createNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    return await notification.save();
};

const getAllNotifications = async () => {
    return await Notification.find().sort({ createdAt: -1 });
};

const getUnreadNotifications = async () => {
    return await Notification.find({ read: false }).sort({ createdAt: -1 });
};

const markAsRead = async (id) => {
    return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};

const markAllAsRead = async () => {
    return await Notification.updateMany({ read: false }, { read: true });
};

const deleteNotification = async (id) => {
    return await Notification.findByIdAndDelete(id);
};

// Auto-generate low stock notifications
const checkLowStock = async () => {
    const lowStockProducts = await Product.find({
        $expr: { $lt: ["$stock", "$minStock"] }
    });

    for (const product of lowStockProducts) {
        // Check if notification already exists for this product
        const existingNotification = await Notification.findOne({
            type: 'low_stock',
            relatedId: product._id.toString(),
            read: false
        });

        if (!existingNotification) {
            await createNotification({
                type: 'low_stock',
                title: 'Low Stock Alert',
                message: `${product.name} is running low (${product.stock} left)`,
                priority: 'high',
                relatedId: product._id.toString(),
                relatedType: 'product'
            });
        }
    }
};

module.exports = {
    createNotification,
    getAllNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    checkLowStock,
};
