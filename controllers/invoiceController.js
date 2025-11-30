const invoiceService = require('../services/invoiceService');

const createInvoice = async (req, res) => {
    try {
        const invoice = await invoiceService.createInvoice(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getAllInvoices();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const result = await invoiceService.deleteInvoice(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    deleteInvoice,
};
