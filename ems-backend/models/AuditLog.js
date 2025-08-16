const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM(
      'LOGIN',
      'LOGOUT',
      'CREATE',
      'READ',
      'UPDATE',
      'DELETE',
      'ACCESS',
      'EXPORT',
      'PERMISSION_CHANGE'
    ),
    allowNull: false
  },
  resourceType: {
    type: DataTypes.ENUM('USER', 'TASK', 'DEPARTMENT', 'AUTH', 'SYSTEM'),
    allowNull: false
  },
  resourceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resourceName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  changes: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'AuditLogs',
  indexes: [
    {
      fields: ['userId', 'createdAt']
    },
    {
      fields: ['resourceType', 'createdAt']
    },
    {
      fields: ['resourceId', 'createdAt']
    },
    {
      fields: ['action', 'createdAt']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = AuditLog;
