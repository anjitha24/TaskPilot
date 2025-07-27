const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/badges - Create a new badge (Admin only)
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Action not authorized. Admins only.' });
  }

  try {
    const { name, description, icon, points } = req.body;
    const newBadge = new Badge({ name, description, icon, points });
    const savedBadge = await newBadge.save();
    res.status(201).json(savedBadge);
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/badges - Get all available badges
router.get('/', protect, async (req, res) => {
    try {
        const badges = await Badge.find({});
        res.json(badges);
    } catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;