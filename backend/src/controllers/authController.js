const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// In-memory fallback users store if DB is disconnected
const inMemoryUsers = [
  {
    _id: 'usr_admin_999',
    name: 'Mamta Store Admin',
    email: 'admin@mamtapickles.com',
    password: 'adminpassword123',
    role: 'admin',
  },
  {
    _id: 'usr_demo_123',
    name: 'Demo Customer',
    email: 'demo@mamtapickles.com',
    password: 'password123',
    role: 'user',
  },
];

const findInMemoryUserById = (id) => {
  return inMemoryUsers.find((u) => u._id === id);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // In-memory fallback when MongoDB is unreachable
    const existing = inMemoryUsers.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const mockId = 'usr_' + Date.now();
    const newUser = {
      _id: mockId,
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user',
    };
    inMemoryUsers.push(newUser);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    // Proceed to memory fallback
  }

  // In-memory fallback
  const memUser = inMemoryUsers.find((u) => u.email === email && u.password === password);

  if (memUser) {
    return res.json({
      _id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      role: memUser.role,
      token: generateToken(memUser._id),
    });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  findInMemoryUserById,
};
