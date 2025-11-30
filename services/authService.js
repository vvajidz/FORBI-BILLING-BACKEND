const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    const { username, password, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        username,
        password: hashedPassword,
        role: role || null, // Expecting role ID or null
    });

    return user;
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username }).populate('role');

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123', // Use env var in production
            { expiresIn: '30d' }
        );
        return { user, token };
    } else {
        throw new Error('Invalid credentials');
    }
};

module.exports = {
    registerUser,
    loginUser,
};
