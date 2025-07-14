const express = require('express');
const { body } = require('express-validator');
const { register } = require('../controllers/registerController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], register);

// Protected route for authenticated users
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;