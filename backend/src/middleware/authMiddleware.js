const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../config/env');
const { findInMemoryUserById } = require('../controllers/authController');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user from DB or in-memory fallback
      try {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {
        // DB error or non-ObjectId format
      }

      // Check in-memory users store
      const memUser = findInMemoryUserById(decoded.id);
      if (memUser) {
        req.user = {
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role || 'user',
        };
        return next();
      }

      req.user = { _id: decoded.id, email: 'user@mamtapickles.com', role: 'user' };
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please log in first' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
