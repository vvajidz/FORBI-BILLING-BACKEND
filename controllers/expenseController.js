const expenseService = require('../services/expenseService');

const createExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getAllExpenses();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expense = await expenseService.updateExpense(req.params.id, req.body);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await expenseService.deleteExpense(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
};
