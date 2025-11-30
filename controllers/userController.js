const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

// Get all users with their roles
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name').select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { username, password, roleId } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            password: hashedPassword,
            role: roleId
        });

        const savedUser = await user.save();

        // Return user without password
        const userResponse = await User.findById(savedUser._id).populate('role', 'name').select('-password');
        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { username, password, roleId } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update username if changed
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }

        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update role if provided
        if (roleId) {
            user.role = roleId;
        }

        await user.save();

        const updatedUser = await User.findById(user._id).populate('role', 'name').select('-password');
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting the last admin (optional safety check, can be enhanced)

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message });
    }
};
