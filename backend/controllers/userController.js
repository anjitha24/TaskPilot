const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // ✅ MODIFIED: Added .populate('badges') to include badge details with each user
    const users = await User.find().select('-password').populate('badges');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add user
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User added', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Add failed', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser
};