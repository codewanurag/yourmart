const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Product = require('../models/Product');
const { LiveSession } = require('../models/LiveSession');
const { protect } = require('../middleware/auth');

// POST /api/users/follow/:sellerId
router.post('/follow/:sellerId', protect, async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    if (sellerId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const seller = await User.findOne({ _id: sellerId, isSeller: true });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: sellerId } });
    await User.findByIdAndUpdate(sellerId, { $addToSet: { followers: req.user._id } });

    const updatedSeller = await User.findById(sellerId).select('-password -notifications');
    res.json({ success: true, seller: updatedSeller, message: 'Seller followed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/unfollow/:sellerId
router.post('/unfollow/:sellerId', protect, async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    await User.findByIdAndUpdate(req.user._id, { $pull: { following: sellerId } });
    await User.findByIdAndUpdate(sellerId, { $pull: { followers: req.user._id } });

    const updatedSeller = await User.findById(sellerId).select('-password -notifications');
    res.json({ success: true, seller: updatedSeller, message: 'Seller unfollowed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/following
router.get('/following', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', '-password -notifications');

    res.json({ success: true, following: user.following || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/following-feed
router.get('/following-feed', protect, async (req, res) => {
  try {
    const me = await User.findById(req.user._id).select('following');
    const followingIds = me.following || [];

    const products = await Product.find({ seller: { $in: followingIds } })
      .populate('seller', 'name avatar sellerInfo location followers')
      .sort({ createdAt: -1 })
      .limit(12);

    const liveSessions = await LiveSession.find({ seller: { $in: followingIds }, isLive: true })
      .populate('seller', 'name avatar sellerInfo location followers')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({ success: true, products, liveSessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ success: true, notifications: user.notifications || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/notifications/read-all
router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].read': true },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;