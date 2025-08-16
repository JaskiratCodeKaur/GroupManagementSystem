const AuditLog = require('../models/AuditLog');

/**
 * Middleware to automatically log all requests for audit trail
 * Captures user actions, accessed resources, and timestamps
 */
const auditLogger = async (req, res, next) => {
  // Store original res.json to capture response
  const originalJson = res.json.bind(res);
  
  // Capture start time
  const startTime = Date.now();
  
  // Override res.json to capture status code and response
  res.json = function(data) {
    // Don't log if user is not authenticated (public routes)
    if (req.user && req.user.id) {
      // Determine action type based on HTTP method and endpoint
      const action = determineAction(req.method, req.path, data);
      const resourceType = determineResourceType(req.path);
      
      // Extract resource information
      const resourceInfo = extractResourceInfo(req, data);
      
      // Create audit log entry
      const auditData = {
        userId: req.user.id,
        userName: req.user.name || 'Unknown',
        userEmail: req.user.email || 'Unknown',
        action: action,
        resourceType: resourceType,
        resourceId: resourceInfo.id,
        resourceName: resourceInfo.name,
        method: req.method,
        endpoint: req.path,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        changes: resourceInfo.changes,
        metadata: {
          responseTime: Date.now() - startTime,
          queryParams: req.query,
          bodyParams: sanitizeBody(req.body),
        },
      };
      
      // Async log creation (don't wait for it)
      AuditLog.create(auditData).catch(err => {
        console.error('Failed to create audit log:', err);
      });
    }
    
    return originalJson(data);
  };
  
  next();
};

/**
 * Determine the action type based on HTTP method and path
 */
function determineAction(method, path, responseData) {
  if (path.includes('/login')) return 'LOGIN';
  if (path.includes('/logout')) return 'LOGOUT';
  
  switch (method) {
    case 'GET':
      return 'READ';
    case 'POST':
      return 'CREATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return 'ACCESS';
  }
}

/**
 * Determine the resource type based on the endpoint path
 */
function determineResourceType(path) {
  if (path.includes('/user')) return 'USER';
  if (path.includes('/task')) return 'TASK';
  if (path.includes('/department')) return 'DEPARTMENT';
  if (path.includes('/auth')) return 'AUTH';
  return 'SYSTEM';
}

/**
 * Extract resource information from request and response
 */
function extractResourceInfo(req, responseData) {
  const info = {
    id: null,
    name: null,
    changes: null,
  };
  
  // Extract ID from URL params
  if (req.params && req.params.id) {
    info.id = req.params.id;
  }
  
  // Extract ID from response data
  if (responseData) {
    if (responseData._id) {
      info.id = responseData._id.toString();
    }
    if (responseData.id) {
      info.id = responseData.id.toString();
    }
    
    // Extract name/title
    info.name = responseData.name || responseData.title || responseData.email || null;
    
    // For tasks, capture the task data
    if (responseData.task) {
      info.id = responseData.task._id?.toString() || info.id;
      info.name = responseData.task.title || info.name;
    }
    
    // For users array responses
    if (Array.isArray(responseData.tasks)) {
      info.name = `${responseData.tasks.length} tasks`;
    }
    if (Array.isArray(responseData) && responseData.length > 0) {
      info.name = `${responseData.length} records`;
    }
  }
  
  // Capture changes for UPDATE operations
  if (req.method === 'PUT' || req.method === 'PATCH') {
    info.changes = sanitizeBody(req.body);
  }
  
  return info;
}

/**
 * Sanitize request body to remove sensitive information
 */
function sanitizeBody(body) {
  if (!body) return null;
  
  const sanitized = { ...body };
  
  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.secret;
  
  return sanitized;
}

/**
 * Create a manual audit log entry (for use in controllers)
 */
const createAuditLog = async (logData) => {
  try {
    await AuditLog.create(logData);
  } catch (err) {
    console.error('Failed to create manual audit log:', err);
  }
};

module.exports = { auditLogger, createAuditLog };
