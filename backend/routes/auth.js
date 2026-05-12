const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

      const user = await User.create({ name, email, password });
      const token = signToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id:      user._id,
          name:     user.name,
          email:    user.email,
          avatar:   user.avatar,
          isSeller: user.isSeller,
          sellerInfo: user.sellerInfo,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = signToken(user._id);
      res.json({
        success: true,
        token,
        user: {
          _id:        user._id,
          name:       user.name,
          email:      user.email,
          avatar:     user.avatar,
          isSeller:   user.isSeller,
          sellerInfo: user.sellerInfo,
          bio:        user.bio,
          location:   user.location,
          phone:      user.phone,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/update-profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, bio, location, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, bio, location, phone, avatar } },
      { new: true, select: '-password' }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/become-seller
router.put('/become-seller', protect, async (req, res) => {
  try {
    const { storeName, storeTag, storeDesc } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { isSeller: true, 'sellerInfo.storeName': storeName, 'sellerInfo.storeTag': storeTag, 'sellerInfo.storeDesc': storeDesc } },
      { new: true, select: '-password' }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
