const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createAuditLog } = require('../middleware/auditLogger');

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);

        // Log successful login
        await createAuditLog({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            action: 'LOGIN',
            resourceType: 'AUTH',
            method: 'POST',
            endpoint: '/api/auth/login',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            statusCode: 200,
            metadata: {
                loginTime: new Date(),
            },
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
