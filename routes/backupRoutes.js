const express = require('express');
const router = express.Router();
const { createBackup, restoreBackup, resetDatabase } = require('../controllers/backupController');

router.get('/export', createBackup);
router.post('/restore', restoreBackup);
router.delete('/reset', resetDatabase);

module.exports = router;
