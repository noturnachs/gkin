const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Handle user login with role-based authentication
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const login = (req, res) => {
  try {
    const { username, role, passcode } = req.body;

    // Validate request body
    if (!username || !role || !passcode) {
      return res.status(400).json({ message: 'Username, role, and passcode are required' });
    }

    // Check if role is valid
    if (!config.passcodes[role]) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if passcode is correct for the role
    if (passcode !== config.passcodes[role]) {
      return res.status(401).json({ message: 'Invalid passcode for this role' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: Math.floor(Math.random() * 1000), username, role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Return user info and token
    res.status(200).json({
      id: Math.floor(Math.random() * 1000),
      username,
      role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Verify if token is valid
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const verifyAuth = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  login,
  verifyAuth
};
