const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/adjust', stockController.adjustStock);
router.get('/adjustments', stockController.getAdjustments);

module.exports = router;
