const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();


// ------------------ Google OAuth ------------------

// @route   GET /api/auth/google
// @desc    Redirects to Google for authentication
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /api/auth/google/callback
// @desc    Handles Google OAuth callback and returns JWT token
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Redirect with token as query parameter to frontend
    res.redirect(`https://su-manth09-signin-signup-page-backend.onrender.com?token=${token}`);
  }
);

module.exports = router;
