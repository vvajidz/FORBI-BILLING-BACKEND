const reportService = require('../services/reportService');

exports.getReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        let result;

        switch (type) {
            case 'sales-summary':
                result = await reportService.getSalesSummary(startDate, endDate);
                break;
            case 'sales-by-item':
                result = await reportService.getSalesByItem(startDate, endDate);
                break;
            case 'sales-by-customer':
                result = await reportService.getSalesByCustomer(startDate, endDate);
                break;
            case 'expense-report':
                result = await reportService.getExpenseReport(startDate, endDate);
                break;
            case 'stock-valuation':
                result = await reportService.getStockValuation();
                break;
            case 'purchase-summary':
                result = await reportService.getPurchaseSummary(startDate, endDate);
                break;
            default:
                return res.status(400).json({ message: "Invalid report type" });
        }

        res.json(result);
    } catch (error) {
        console.error("Report generation failed:", error);
        res.status(500).json({ message: error.message });
    }
};
