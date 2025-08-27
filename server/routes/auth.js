const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Login route
router.post('/login', authController.login);

// Verify authentication route
router.get('/verify', verifyToken, authController.verifyAuth);

module.exports = router;
