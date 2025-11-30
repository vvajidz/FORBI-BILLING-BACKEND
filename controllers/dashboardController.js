const dashboardService = require('../services/dashboardService');

const getStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats
};
