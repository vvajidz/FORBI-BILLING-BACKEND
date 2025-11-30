const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const { initializeDefaultRoles } = require('./controllers/roleController');

// Connect to database
connectDB();

// Initialize default roles
initializeDefaultRoles();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'], // Allow frontend origins
    credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/backup', require('./routes/backupRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/deleted', require('./routes/deletedItemsRoutes'));
app.use('/api/salaries', require('./routes/salaryRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
