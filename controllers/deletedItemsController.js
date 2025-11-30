const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Employee = require('../models/Employee');
const Expense = require('../models/Expense');

const getAllDeleted = async (req, res) => {
    try {
        const [invoices, products, customers, suppliers, employees, expenses] = await Promise.all([
            Invoice.find({ deletedAt: { $ne: null } }).select('invoiceNo customerName grandTotal deletedAt').lean(),
            Product.find({ deletedAt: { $ne: null } }).select('name barcode category price deletedAt').lean(),
            Customer.find({ deletedAt: { $ne: null } }).select('name phone email deletedAt').lean(),
            Supplier.find({ deletedAt: { $ne: null } }).select('name phone contact deletedAt').lean(),
            Employee.find({ deletedAt: { $ne: null } }).select('name phoneNumber role deletedAt').lean(),
            Expense.find({ deletedAt: { $ne: null } }).select('category description amount deletedAt').lean(),
        ]);

        const deletedItems = [
            ...invoices.map(item => ({ ...item, type: 'invoice', model: 'Invoice' })),
            ...products.map(item => ({ ...item, type: 'product', model: 'Product' })),
            ...customers.map(item => ({ ...item, type: 'customer', model: 'Customer' })),
            ...suppliers.map(item => ({ ...item, type: 'supplier', model: 'Supplier' })),
            ...employees.map(item => ({ ...item, type: 'employee', model: 'Employee' })),
            ...expenses.map(item => ({ ...item, type: 'expense', model: 'Expense' })),
        ];

        // Sort by deletion date (most recent first)
        deletedItems.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

        res.json(deletedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const restoreItem = async (req, res) => {
    try {
        const { model, id } = req.params;

        const modelMap = {
            'Invoice': Invoice,
            'Product': Product,
            'Customer': Customer,
            'Supplier': Supplier,
            'Employee': Employee,
            'Expense': Expense,
        };

        const Model = modelMap[model];
        if (!Model) {
            return res.status(400).json({ message: 'Invalid model type' });
        }

        const item = await Model.findByIdAndUpdate(
            id,
            { deletedAt: null },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item restored successfully', item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const permanentDelete = async (req, res) => {
    try {
        const { model, id } = req.params;

        const modelMap = {
            'Invoice': Invoice,
            'Product': Product,
            'Customer': Customer,
            'Supplier': Supplier,
            'Employee': Employee,
            'Expense': Expense,
        };

        const Model = modelMap[model];
        if (!Model) {
            return res.status(400).json({ message: 'Invalid model type' });
        }

        const item = await Model.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllDeleted,
    restoreItem,
    permanentDelete,
};
