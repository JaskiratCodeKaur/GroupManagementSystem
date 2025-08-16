const Task = require('../models/Task');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getUpcomingTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ensure beginning of day

    const whereClause = {
      dueDate: { [Op.gte]: today },
      ...(req.user.role === 'employee' && { assignedTo: req.user.id }),
    };

    const tasks = await Task.findAll({
      where: whereClause,
      order: [['dueDate', 'ASC']],
      attributes: ['id', 'title', 'dueDate', 'status']
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching upcoming tasks:', err);
    res.status(500).json({ message: 'Server error fetching upcoming tasks' });
  }
};


// @desc Create a task (admin only)
exports.createTask = async (req, res) => {
  const { title, description, dueDate, category, assignedTo } = req.body;

  if (!title || !description || !dueDate || !assignedTo) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      category,
      assignedTo,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Get tasks (admin sees all, employee sees own) with pagination
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user.id };

    const { count, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    res.json({
      tasks,
      totalCount: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'TaskCreator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Restrict access if not admin and not assigned to the user
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Update task status (employee accept/decline or complete)
exports.updateTaskStatus = async (req, res) => {
  const { status, notes } = req.body;

  const allowedStatuses = ['in progress', 'completed', 'declined'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Employees can only update their own task
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.status = status;
    task.notes = notes || '';
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyTasks = async (req, res) => {
  const employeeId = req.user.id;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: { assignedTo: employeeId },
      offset,
      limit: parseInt(limit)
    });

    res.json({ tasks, totalCount: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



