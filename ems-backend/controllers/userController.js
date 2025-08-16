const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc Create new employee (admin only)
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
};

// @desc Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
