const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');
const Employee = require('../models/Employee');
const Expense = require('../models/Expense');
const Settings = require('../models/Settings');
const StockAdjustment = require('../models/StockAdjustment');
const Notification = require('../models/Notification');

exports.createBackup = async (req, res) => {
    try {
        const data = {
            products: await Product.find(),
            customers: await Customer.find(),
            suppliers: await Supplier.find(),
            invoices: await Invoice.find(),
            purchases: await Purchase.find(),
            employees: await Employee.find(),
            expenses: await Expense.find(),
            settings: await Settings.find(),
            stockAdjustments: await StockAdjustment.find(),
            notifications: await Notification.find(),
            timestamp: new Date().toISOString()
        };
        res.json(data);
    } catch (error) {
        console.error("Backup failed:", error);
        res.status(500).json({ message: "Backup failed: " + error.message });
    }
};

exports.restoreBackup = async (req, res) => {
    try {
        const data = req.body;
        if (!data) return res.status(400).json({ message: "No data provided" });

        // Helper to restore collection
        const restoreCollection = async (Model, items) => {
            if (items && Array.isArray(items) && items.length > 0) {
                await Model.deleteMany({});
                await Model.insertMany(items);
            }
        };

        await restoreCollection(Product, data.products);
        await restoreCollection(Customer, data.customers);
        await restoreCollection(Supplier, data.suppliers);
        await restoreCollection(Invoice, data.invoices);
        await restoreCollection(Purchase, data.purchases);
        await restoreCollection(Employee, data.employees);
        await restoreCollection(Expense, data.expenses);
        await restoreCollection(Settings, data.settings);
        await restoreCollection(StockAdjustment, data.stockAdjustments);
        await restoreCollection(Notification, data.notifications);

        res.json({ message: "Restore successful" });
    } catch (error) {
        console.error("Restore failed:", error);
        res.status(500).json({ message: "Restore failed: " + error.message });
    }
};

exports.resetDatabase = async (req, res) => {
    try {
        await Product.deleteMany({});
        await Customer.deleteMany({});
        await Supplier.deleteMany({});
        await Invoice.deleteMany({});
        await Purchase.deleteMany({});
        await Employee.deleteMany({});
        await Expense.deleteMany({});
        await StockAdjustment.deleteMany({});
        await Notification.deleteMany({});
        // Note: We intentionally do NOT delete Settings or Users to prevent lockout/config loss

        res.json({ message: "Database reset successful" });
    } catch (error) {
        console.error("Reset failed:", error);
        res.status(500).json({ message: "Reset failed: " + error.message });
    }
};
