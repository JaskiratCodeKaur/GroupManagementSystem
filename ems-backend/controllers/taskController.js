const Task = require('../models/Task');

// @desc Create a task (admin only)
exports.createTask = async (req, res) => {
    const { title, description, dueDate, category, assignedTo } = req.body;

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

// @desc Get tasks (admin sees all, employee sees own)
exports.getTasks = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };
        const tasks = await Task.find(query).populate('assignedTo', 'name');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
