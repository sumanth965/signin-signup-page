const express = require('express');
const { body } = require('express-validator');
const { login } = require('../controllers/loginController');
const protect = require('../middleware/authMiddleware');
const { sendOTP, resetPassword } = require('../controllers/loginController');

const router = express.Router();

// Login route with validation
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
], login);

// Protected route for authenticated users
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});
router.post('/send-otp', sendOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
