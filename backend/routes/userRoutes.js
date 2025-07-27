const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Badge = require('../models/Badge');

const { registerUser, loginUser } = require('../controllers/authController');
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// User CRUD Routes
router.get('/', protect, getAllUsers);
router.post('/', protect, addUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

// Route to award a badge to a user
// POST /api/users/:userId/award-badge
router.post('/:userId/award-badge', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Action not authorized. Admins only.' });
  }

  try {
    const { badgeId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    const badge = await Badge.findById(badgeId);

    if (!user || !badge) {
      return res.status(404).json({ message: 'User or Badge not found.' });
    }

    if (user.badges.includes(badgeId)) {
      return res.status(400).json({ message: 'User already has this badge.' });
    }

    user.badges.push(badgeId);
    user.totalPoints += badge.points;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error awarding badge:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ ADDED: New route to remove a badge from a user
// DELETE /api/users/:userId/badges/:badgeId
router.delete('/:userId/badges/:badgeId', protect, async (req, res) => {
  // 1. Check for admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Action not authorized. Admins only.' });
  }

  try {
    const { userId, badgeId } = req.params;

    // 2. Find the badge to get its point value
    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found.' });
    }

    // 3. Find the user and update them in one step
    //    - $pull removes the badgeId from the badges array
    //    - $inc subtracts the points from totalPoints
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { badges: badgeId },
        $inc: { totalPoints: -badge.points }
      },
      { new: true } // This option returns the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error removing badge:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
  
module.exports = router;