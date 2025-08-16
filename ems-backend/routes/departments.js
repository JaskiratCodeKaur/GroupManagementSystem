const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Create a new department
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Department.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Department already exists' });

    const department = await Department.create({ name, description });

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error creating department' });
  }
});

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

module.exports = router;
