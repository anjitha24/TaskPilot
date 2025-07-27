const jwt = require('jsonwebtoken');
const User = require('../models/User');



const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      console.log("Token decoded. User ID:", decoded.id);

      next();
    } else {
      res.status(401).json({ message: 'No token' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token failed', error: error.message });
  }
};


// Middleware to restrict routes to admin users only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Proceed if user is admin
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = {
  protect,
  adminOnly,
};
