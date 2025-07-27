const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Admin creates task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, project } = req.body;
    const user = await User.findById(req.user._id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      project,
    });

    // Create a notification if the task is assigned to someone
    if (assignedTo) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: 'NEW_TASK',
        message: `${req.user.name} assigned you a new task: "${title}"`,
        link: `/dashboard` // ✅ FIXED: Changed link to the member's dashboard
      });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Admin: Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email role').populate('project', 'title');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

// Admin: Update task
const updateTask = async (req, res) => {
  try {
    const taskBeforeUpdate = await Task.findById(req.params.id);
    if (!taskBeforeUpdate) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Check if the task was reassigned to a new user
    const newAssigneeId = req.body.assignedTo;
    if (newAssigneeId && newAssigneeId.toString() !== taskBeforeUpdate.assignedTo?.toString()) {
        await Notification.create({
            recipient: newAssigneeId,
            sender: req.user._id,
            type: 'NEW_TASK',
            message: `${req.user.name} reassigned a task to you: "${updatedTask.title}"`,
            link: `/dashboard` // ✅ FIXED: Changed link to the member's dashboard
        });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Admin: Delete task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};

// GET /api/tasks/user/me
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Team Member: Update status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.status = status;
    await task.save();

    res.json({ message: 'Status updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// Team Member: Comment
const addCommentToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.comments.push({ user: req.user._id, text, createdAt: new Date() });
    await task.save();

    res.json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
  addCommentToTask,
};