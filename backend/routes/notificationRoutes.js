const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/notifications - Get all notifications for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }) // Show newest first
      .populate('sender', 'name'); // Get the sender's name

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/notifications/mark-read - Mark all notifications as read
router.post('/mark-read', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;