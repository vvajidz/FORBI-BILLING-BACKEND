const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.get('/unread', notificationController.getUnreadNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.post('/check-low-stock', notificationController.checkLowStock);

module.exports = router;
