const Employee = require('../models/Employee');

const createEmployee = async (employeeData) => {
    const employee = new Employee(employeeData);
    return await employee.save();
};

const getAllEmployees = async () => {
    return await Employee.find({ deletedAt: null });
};

const getEmployeeById = async (id) => {
    return await Employee.findById(id);
};

const updateEmployee = async (id, updateData) => {
    return await Employee.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteEmployee = async (id) => {
    return await Employee.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};
