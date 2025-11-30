const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/receivables', paymentController.getReceivables);
router.post('/record', paymentController.recordPayment);

module.exports = router;
