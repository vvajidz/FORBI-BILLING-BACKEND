const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Purchase = require('../models/Purchase');

const getSalesSummary = async (startDate, endDate) => {
    const query = {};
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const invoices = await Invoice.find(query).populate('customer', 'name phoneNumber');
    const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalDue = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    return {
        summary: {
            totalSales,
            totalPaid,
            totalDue,
            count: invoices.length
        },
        data: invoices.map(inv => ({
            id: inv._id,
            invoiceNo: inv.invoiceNo,
            date: inv.date,
            customer: inv.customerName || inv.customer?.name || 'Walk-in',
            total: inv.grandTotal,
            paid: inv.amountPaid,
            balance: inv.balance,
            paymentMode: inv.paymentMode
        }))
    };
};

const getSalesByItem = async (startDate, endDate) => {
    const matchStage = {};
    if (startDate && endDate) {
        matchStage.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const data = await Invoice.aggregate([
        { $match: matchStage },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                productName: { $first: "$items.name" },
                totalQty: { $sum: "$items.qty" },
                totalRevenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                name: { $ifNull: ["$productName", "$productInfo.name"] },
                category: "$productInfo.category",
                sku: "$productInfo.barcode",
                quantity: "$totalQty",
                revenue: "$totalRevenue"
            }
        },
        { $sort: { revenue: -1 } }
    ]);

    return { data };
};

const getSalesByCustomer = async (startDate, endDate) => {
    const matchStage = {};
    if (startDate && endDate) {
        matchStage.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const data = await Invoice.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$customer",
                customerName: { $first: "$customerName" },
                totalSpent: { $sum: "$grandTotal" },
                invoiceCount: { $sum: 1 },
                lastPurchase: { $max: "$date" }
            }
        },
        {
            $lookup: {
                from: "customers",
                localField: "_id",
                foreignField: "_id",
                as: "customerInfo"
            }
        },
        { $unwind: { path: "$customerInfo", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                name: { $ifNull: ["$customerInfo.name", "$customerName", "Walk-in"] },
                phone: "$customerInfo.phoneNumber",
                totalSpent: 1,
                invoiceCount: 1,
                lastPurchase: 1
            }
        },
        { $sort: { totalSpent: -1 } }
    ]);

    return { data };
};

const getExpenseReport = async (startDate, endDate) => {
    const query = {};
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Group by category
    const byCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    return {
        summary: { totalExpenses, byCategory },
        data: expenses.map(e => ({
            id: e._id,
            date: e.date,
            category: e.category,
            description: e.description,
            amount: e.amount,
            paymentMode: e.paymentMode
        }))
    };
};

const getStockValuation = async () => {
    const products = await Product.find();
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

    return {
        summary: { totalValue, totalItems, count: products.length },
        data: products.map(p => ({
            id: p._id,
            name: p.name,
            barcode: p.barcode,
            category: p.category,
            stock: p.stock,
            price: p.price,
            value: p.stock * p.price
        }))
    };
};

const getPurchaseSummary = async (startDate, endDate) => {
    const query = {};
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const purchases = await Purchase.find(query).populate('supplier', 'name');
    const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

    return {
        summary: { totalPurchases, count: purchases.length },
        data: purchases.map(p => ({
            id: p._id,
            poNumber: p.poNumber,
            date: p.date,
            supplier: p.supplier?.name || 'Unknown',
            total: p.totalAmount,
            status: p.status
        }))
    };
};

module.exports = {
    getSalesSummary,
    getSalesByItem,
    getSalesByCustomer,
    getExpenseReport,
    getStockValuation,
    getPurchaseSummary
};
