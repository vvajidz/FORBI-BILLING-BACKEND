const stockService = require('../services/stockService');

const adjustStock = async (req, res) => {
    try {
        const adjustment = await stockService.adjustStock(req.body);
        res.status(201).json(adjustment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAdjustments = async (req, res) => {
    try {
        const adjustments = await stockService.getAdjustments();
        res.json(adjustments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    adjustStock,
    getAdjustments,
};
