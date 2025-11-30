const Expense = require('../models/Expense');

const createExpense = async (expenseData) => {
    const expense = new Expense(expenseData);
    return await expense.save();
};

const getAllExpenses = async () => {
    return await Expense.find({ deletedAt: null }).sort({ date: -1 });
};

const getExpenseById = async (id) => {
    return await Expense.findById(id);
};

const updateExpense = async (id, updateData) => {
    return await Expense.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteExpense = async (id) => {
    return await Expense.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
};
