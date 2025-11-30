const purchaseService = require('../services/purchaseService');

const createPurchase = async (req, res) => {
    try {
        const purchase = await purchaseService.createPurchase(req.body);
        res.status(201).json(purchase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPurchases = async (req, res) => {
    try {
        const purchases = await purchaseService.getAllPurchases();
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchaseById = async (req, res) => {
    try {
        const purchase = await purchaseService.getPurchaseById(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePurchase = async (req, res) => {
    try {
        await purchaseService.deletePurchase(req.params.id);
        res.json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    deletePurchase,
};
