const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');

const getReceivables = async (req, res) => {
    try {
        // Get all invoices with outstanding balance
        const invoices = await Invoice.find({ balance: { $gt: 0 } })
            .populate('customer', 'name phone')
            .sort({ date: 1 });

        // Group by customer
        const receivablesMap = {};

        invoices.forEach(invoice => {
            const customerId = invoice.customer?._id?.toString() || 'walk-in';
            const customerName = invoice.customer?.name || invoice.customerName || 'Walk-in Customer';

            if (!receivablesMap[customerId]) {
                receivablesMap[customerId] = {
                    customerId,
                    customerName,
                    customerPhone: invoice.customer?.phone || '',
                    totalDue: 0,
                    invoices: [],
                    oldestDue: invoice.date,
                    lastPayment: invoice.updatedAt,
                };
            }

            receivablesMap[customerId].totalDue += invoice.balance;
            receivablesMap[customerId].invoices.push({
                invoiceNo: invoice.invoiceNo,
                invoiceId: invoice._id,
                date: invoice.date,
                grandTotal: invoice.grandTotal,
                amountPaid: invoice.amountPaid,
                balance: invoice.balance,
            });

            // Track oldest due date
            if (new Date(invoice.date) < new Date(receivablesMap[customerId].oldestDue)) {
                receivablesMap[customerId].oldestDue = invoice.date;
            }

            // Track most recent payment
            if (new Date(invoice.updatedAt) > new Date(receivablesMap[customerId].lastPayment)) {
                receivablesMap[customerId].lastPayment = invoice.updatedAt;
            }
        });

        // Convert to array and add overdue status
        const receivables = Object.values(receivablesMap).map(item => {
            const daysSinceOldest = Math.floor((Date.now() - new Date(item.oldestDue).getTime()) / (1000 * 60 * 60 * 24));
            return {
                ...item,
                overdue: daysSinceOldest > 30, // Consider overdue after 30 days
                daysSinceOldest,
            };
        });

        res.json(receivables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const recordPayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentMode, date } = req.body;

        if (!invoiceId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid payment data' });
        }

        const invoice = await Invoice.findById(invoiceId).populate('customer');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (amount > invoice.balance) {
            return res.status(400).json({ message: 'Payment amount exceeds outstanding balance' });
        }

        // Update invoice
        invoice.amountPaid += amount;
        invoice.balance -= amount;

        if (paymentMode) {
            invoice.paymentMode = paymentMode;
        }

        await invoice.save();

        // Update customer outstanding
        if (invoice.customer) {
            await Customer.findByIdAndUpdate(
                invoice.customer._id,
                { $inc: { outstanding: -amount } }
            );
        }

        res.json({
            message: 'Payment recorded successfully',
            invoice: {
                invoiceNo: invoice.invoiceNo,
                amountPaid: invoice.amountPaid,
                balance: invoice.balance,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReceivables,
    recordPayment,
};
