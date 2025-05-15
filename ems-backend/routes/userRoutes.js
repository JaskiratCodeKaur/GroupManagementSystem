const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all users (admin only)
router.get('/', auth, admin, async (req, res) => {
    const users = await User.find({ role: 'employee' }).select('-password');
    res.json(users);
});

// Delete a user (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
});

module.exports = router;
