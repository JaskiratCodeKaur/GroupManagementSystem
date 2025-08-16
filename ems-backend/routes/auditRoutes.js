const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const auditController = require('../controllers/auditController');

// @route   GET /api/audit
// @desc    Get all audit logs (with filtering)
// @access  Admin only
router.get('/', auth, admin, auditController.getAuditLogs);

// @route   GET /api/audit/stats
// @desc    Get audit statistics and insights
// @access  Admin only
router.get('/stats', auth, admin, auditController.getAuditStats);

// @route   GET /api/audit/export
// @desc    Export audit logs to CSV
// @access  Admin only
router.get('/export', auth, admin, auditController.exportAuditLogs);

// @route   GET /api/audit/me
// @desc    Get my own audit trail
// @access  Authenticated users
router.get('/me', auth, auditController.getMyAuditLogs);

// @route   GET /api/audit/user/:userId
// @desc    Get audit logs for a specific user
// @access  Admin only
router.get('/user/:userId', auth, admin, auditController.getUserAuditLogs);

// @route   GET /api/audit/resource/:resourceType/:resourceId
// @desc    Get audit logs for a specific resource
// @access  Admin only
router.get('/resource/:resourceType/:resourceId', auth, admin, auditController.getResourceAuditLogs);

module.exports = router;
