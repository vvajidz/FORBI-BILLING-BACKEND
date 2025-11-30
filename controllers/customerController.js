const customerService = require('../services/customerService');

const createCustomer = async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.body);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await customerService.deleteCustomer(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
