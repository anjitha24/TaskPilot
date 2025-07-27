const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// GET /api/leaderboard
// Fetches the top 10 users ranked by points
router.get('/', async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ totalPoints: -1 }) // Sorts users by totalPoints in descending order
      .limit(10) // Gets only the top 10 users
      .select('-password') // Excludes the password field from the result
      .populate('badges'); // Replaces badge IDs with the full badge documents (name, icon, etc.)

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;