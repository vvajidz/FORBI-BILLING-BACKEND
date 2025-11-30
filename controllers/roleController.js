const Role = require('../models/Role');
const User = require('../models/User');

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().sort({ isDefault: -1, name: 1 });
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single role
exports.getRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create new role
exports.createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        // Check if role name already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: 'Role name already exists' });
        }

        const role = new Role({
            name,
            description,
            permissions,
            isDefault: false
        });

        const savedRole = await role.save();
        res.status(201).json(savedRole);
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update role
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Prevent modifying default roles
        if (role.isDefault) {
            return res.status(403).json({ message: 'Cannot modify default roles' });
        }

        const { name, description, permissions } = req.body;

        // Check if new name conflicts with existing role
        if (name && name !== role.name) {
            const existingRole = await Role.findOne({ name });
            if (existingRole) {
                return res.status(400).json({ message: 'Role name already exists' });
            }
        }

        role.name = name || role.name;
        role.description = description !== undefined ? description : role.description;
        role.permissions = permissions || role.permissions;

        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Prevent deleting default roles
        if (role.isDefault) {
            return res.status(403).json({ message: 'Cannot delete default roles' });
        }

        // Check if role is assigned to any users
        const usersWithRole = await User.countDocuments({ role: req.params.id });
        if (usersWithRole > 0) {
            return res.status(400).json({
                message: `Cannot delete role.${usersWithRole} user(s) are assigned to this role.`
            });
        }

        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: error.message });
    }
};

// Initialize default roles
exports.initializeDefaultRoles = async () => {
    try {
        // Check if Admin role exists
        let adminRole = await Role.findOne({ name: 'Admin' });

        if (!adminRole) {
            adminRole = await Role.create({
                name: 'Admin',
                description: 'Full system access',
                permissions: {
                    dashboard: true,
                    billing: true,
                    invoices: true,
                    purchases: true,
                    products: true,
                    inventory: true,
                    customers: true,
                    suppliers: true,
                    employees: true,
                    expenses: true,
                    payments: true,
                    reports: true,
                    settings: true
                },
                isDefault: true
            });
            console.log('Default Admin role created');
        }

        // Ensure 'admin' user has the Admin role
        const adminUser = await User.findOne({ username: 'admin' });
        if (adminUser) {
            // If admin user has no role or invalid role, assign Admin role
            if (!adminUser.role || adminUser.role.toString() !== adminRole._id.toString()) {
                adminUser.role = adminRole._id;
                await adminUser.save();
                console.log('Assigned Admin role to admin user');
            }
        }
    } catch (error) {
        console.error('Error initializing default roles:', error);
    }
};
