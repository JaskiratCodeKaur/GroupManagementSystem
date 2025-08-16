const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

/**
 * @desc Get audit logs with filtering, pagination, and search
 * @route GET /api/audit
 * @access Admin only
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      resourceType,
      action,
      startDate,
      endDate,
      search,
    } = req.query;

    // Build query
    const query = {};

    if (userId) query.userId = userId;
    if (resourceType) query.resourceType = resourceType;
    if (action) query.action = action;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search filter (searches in userName, userEmail, resourceName, endpoint)
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { resourceName: { $regex: search, $options: 'i' } },
        { endpoint: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, totalCount] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email role'),
      AuditLog.countDocuments(query),
    ]);

    res.json({
      logs,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};

/**
 * @desc Get audit logs for a specific resource
 * @route GET /api/audit/resource/:resourceType/:resourceId
 * @access Admin only
 */
exports.getResourceAuditLogs = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { limit = 50 } = req.query;

    const logs = await AuditLog.find({
      resourceType: resourceType.toUpperCase(),
      resourceId: resourceId,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email role');

    res.json({
      logs,
      totalCount: logs.length,
      resourceType,
      resourceId,
    });
  } catch (err) {
    console.error('Error fetching resource audit logs:', err);
    res.status(500).json({ message: 'Failed to fetch resource audit logs' });
  }
};

/**
 * @desc Get audit logs for a specific user
 * @route GET /api/audit/user/:userId
 * @access Admin only
 */
exports.getUserAuditLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, totalCount, user] = await Promise.all([
      AuditLog.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments({ userId }),
      User.findById(userId).select('name email role'),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      logs,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      user,
    });
  } catch (err) {
    console.error('Error fetching user audit logs:', err);
    res.status(500).json({ message: 'Failed to fetch user audit logs' });
  }
};

/**
 * @desc Get audit statistics and insights
 * @route GET /api/audit/stats
 * @access Admin only
 */
exports.getAuditStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [
      totalLogs,
      actionStats,
      resourceStats,
      topUsers,
      recentActivity,
    ] = await Promise.all([
      // Total logs count
      AuditLog.countDocuments({ createdAt: { $gte: startDate } }),

      // Action breakdown
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Resource type breakdown
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$resourceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Top active users
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$userId', count: { $sum: 1 }, userName: { $first: '$userName' } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Recent activity (last 24 hours)
      AuditLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    res.json({
      period: `Last ${days} days`,
      totalLogs,
      recentActivity,
      actionBreakdown: actionStats.map(s => ({ action: s._id, count: s.count })),
      resourceBreakdown: resourceStats.map(s => ({ resource: s._id, count: s.count })),
      topUsers: topUsers.map(u => ({ userId: u._id, userName: u.userName, activityCount: u.count })),
    });
  } catch (err) {
    console.error('Error fetching audit stats:', err);
    res.status(500).json({ message: 'Failed to fetch audit statistics' });
  }
};

/**
 * @desc Export audit logs to CSV
 * @route GET /api/audit/export
 * @access Admin only
 */
exports.exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, userId, resourceType, action } = req.query;

    // Build query
    const query = {};
    if (userId) query.userId = userId;
    if (resourceType) query.resourceType = resourceType;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(10000) // Limit export to 10k records
      .populate('userId', 'name email role');

    // Convert to CSV
    const csvHeader = 'Timestamp,User,Email,Action,Resource Type,Resource Name,Endpoint,IP Address,Status Code\n';
    const csvRows = logs.map(log => {
      const timestamp = log.createdAt.toISOString();
      const user = log.userName || 'Unknown';
      const email = log.userEmail || 'Unknown';
      const action = log.action;
      const resourceType = log.resourceType;
      const resourceName = (log.resourceName || 'N/A').replace(/,/g, ';');
      const endpoint = log.endpoint;
      const ip = log.ipAddress || 'N/A';
      const statusCode = log.statusCode || 'N/A';

      return `${timestamp},${user},${email},${action},${resourceType},${resourceName},${endpoint},${ip},${statusCode}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Error exporting audit logs:', err);
    res.status(500).json({ message: 'Failed to export audit logs' });
  }
};

/**
 * @desc Get my own audit trail (for employees to see their own activity)
 * @route GET /api/audit/me
 * @access Authenticated users
 */
exports.getMyAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, totalCount] = await Promise.all([
      AuditLog.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments({ userId: req.user.id }),
    ]);

    res.json({
      logs,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Error fetching personal audit logs:', err);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};
