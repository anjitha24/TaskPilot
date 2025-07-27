// controllers/summaryController.js
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Done' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const todoTasks = await Task.countDocuments({ status: 'To Do' });

    res.json({
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Summary fetch failed', error: err.message });
  }
};

module.exports = { getDashboardSummary };
