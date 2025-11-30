const supplierService = require('../services/supplierService');

const createSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.createSupplier(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierService.getAllSuppliers();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await supplierService.getSupplierById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.updateSupplier(req.params.id, req.body);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.deleteSupplier(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ message: 'Supplier deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
