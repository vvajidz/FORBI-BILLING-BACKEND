const Salary = require('../models/Salary');
const Employee = require('../models/Employee');

// Add new salary record
const addSalary = async (req, res) => {
    try {
        const { employee, month, year, baseSalary, allowances, deductions, paymentMode, notes } = req.body;

        // Calculate net salary
        const netSalary = baseSalary + (allowances || 0) - (deductions || 0);

        const salary = new Salary({
            employee,
            month,
            year,
            baseSalary,
            allowances: allowances || 0,
            deductions: deductions || 0,
            netSalary,
            paymentMode,
            notes,
        });

        await salary.save();
        res.status(201).json(salary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all salaries (admin only)
const getAllSalaries = async (req, res) => {
    try {
        const { month, year, status, department } = req.query;
        let query = { deletedAt: null };

        if (month) query.month = month;
        if (year) query.year = parseInt(year);
        if (status) query.paymentStatus = status;

        let salaries = await Salary.find(query)
            .populate('employee', 'name employeeId department role')
            .sort({ createdAt: -1 });

        // Filter by department if specified
        if (department) {
            salaries = salaries.filter(s => s.employee?.department === department);
        }

        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get salaries for specific employee
const getEmployeeSalaries = async (req, res) => {
    try {
        const { id } = req.params;
        const salaries = await Salary.find({
            employee: id,
            deletedAt: null
        }).sort({ year: -1, month: -1 });

        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get salaries by month
const getSalaryByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const [year, monthNum] = month.split('-');

        const salaries = await Salary.find({
            month,
            year: parseInt(year),
            deletedAt: null
        }).populate('employee', 'name employeeId department role');

        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update salary record
const updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { baseSalary, allowances, deductions, paymentStatus, paymentDate, paymentMode, notes } = req.body;

        // Recalculate net salary if amounts changed
        let updateData = { ...req.body };
        if (baseSalary !== undefined || allowances !== undefined || deductions !== undefined) {
            const salary = await Salary.findById(id);
            const newBase = baseSalary !== undefined ? baseSalary : salary.baseSalary;
            const newAllowances = allowances !== undefined ? allowances : salary.allowances;
            const newDeductions = deductions !== undefined ? deductions : salary.deductions;
            updateData.netSalary = newBase + newAllowances - newDeductions;
        }

        const salary = await Salary.findByIdAndUpdate(id, updateData, { new: true });
        res.json(salary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark salary as paid
const markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentDate, paymentMode } = req.body;

        const salary = await Salary.findByIdAndUpdate(
            id,
            {
                paymentStatus: 'Paid',
                paymentDate: paymentDate || new Date(),
                paymentMode: paymentMode || 'Bank Transfer',
            },
            { new: true }
        );

        res.json(salary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete salary record (soft delete)
const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        await Salary.findByIdAndUpdate(id, { deletedAt: new Date() });
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addSalary,
    getAllSalaries,
    getEmployeeSalaries,
    getSalaryByMonth,
    updateSalary,
    markAsPaid,
    deleteSalary,
};
