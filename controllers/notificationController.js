const notificationService = require('../services/notificationService');

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getAllNotifications();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getUnreadNotifications();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id);
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead();
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await notificationService.deleteNotification(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkLowStock = async (req, res) => {
    try {
        await notificationService.checkLowStock();
        res.json({ message: 'Low stock check completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    checkLowStock,
};
