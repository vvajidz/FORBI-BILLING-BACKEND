const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const getDashboardStats = async () => {
    // 1. Total Revenue (Sum of all completed invoices)
    const revenueResult = await Invoice.aggregate([
        { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // 2. Total Expenses
    const expenseResult = await Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpenses = expenseResult[0]?.total || 0;

    // 3. Total Profit
    const totalProfit = totalRevenue - totalExpenses;

    // 4. Counts
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalInvoices = await Invoice.countDocuments();

    // 5. Low Stock Items (limit 5)
    const lowStockItems = await Product.find({
        $expr: { $lt: ["$stock", "$minStock"] }
    }).limit(5).select('name stock minStock');

    // 6. Recent Invoices (limit 5)
    const recentInvoices = await Invoice.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'name')
        .select('invoiceNo grandTotal createdAt');

    // 7. Top Selling Products (Aggregation)
    const topProducts = await Invoice.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                totalSold: { $sum: "$items.qty" },
                revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        { $unwind: "$productInfo" },
        {
            $project: {
                name: "$productInfo.name",
                totalSold: 1,
                revenue: 1
            }
        }
    ]);

    // 8. Sales History (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesHistory = await Invoice.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: "$grandTotal" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 9. Expense History (Last 7 Days)
    const expenseHistory = await Expense.aggregate([
        { $match: { date: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                expenses: { $sum: "$amount" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Merge History Data
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const sales = salesHistory.find(h => h._id === dateStr)?.sales || 0;
        const expenses = expenseHistory.find(h => h._id === dateStr)?.expenses || 0;

        chartData.push({
            date: dateStr,
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            sales,
            expenses
        });
    }

    return {
        kpi: {
            totalRevenue,
            totalExpenses,
            totalProfit,
            totalProducts,
            totalCustomers,
            totalInvoices
        },
        lowStockItems,
        recentInvoices,
        topProducts,
        chartData
    };
};

module.exports = {
    getDashboardStats
};
