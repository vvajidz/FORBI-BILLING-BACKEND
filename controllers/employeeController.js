const employeeService = require('../services/employeeService');

const createEmployee = async (req, res) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await employeeService.updateEmployee(req.params.id, req.body);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await employeeService.deleteEmployee(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};
