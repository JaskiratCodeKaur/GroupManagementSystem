const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { initDatabase } = require('./config/initDatabase');
const { auditLogger } = require('./middleware/auditLogger');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Audit logging middleware (must be after express.json() and before routes)
app.use(auditLogger);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/departments', require('./routes/departments'));

// Root route (health check)
app.get('/', (req, res) => {
    res.send('Employment Management System API is running.');
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

