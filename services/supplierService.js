const Supplier = require('../models/Supplier');

const createSupplier = async (supplierData) => {
    const supplier = new Supplier(supplierData);
    return await supplier.save();
};

const getAllSuppliers = async () => {
    return await Supplier.find({ deletedAt: null });
};

const getSupplierById = async (id) => {
    return await Supplier.findById(id);
};

const updateSupplier = async (id, updateData) => {
    return await Supplier.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteSupplier = async (id) => {
    return await Supplier.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
