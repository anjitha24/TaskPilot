// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: '7d',
//   });
// };

// // Register
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role: requestedRole } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const role = requestedRole;
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: 'Invalid credentials' });

// res.status(200).json({
//   token: generateToken(user._id),
//   user: {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role
//   }
// });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Get Profile
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update Profile
// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       if (req.body.password) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(req.body.password, salt);
//       }

//       const updatedUser = await user.save();
//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//         token: generateToken(updatedUser._id),
//       });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Get all users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update user
// const updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.role = req.body.role || user.role;

//     await user.save();
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete user
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'User deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };




// module.exports = {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile,
//   getAllUsers,
//   updateUser,
//   deleteUser
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
