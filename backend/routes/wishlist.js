const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// In-memory per-session: wishlist stored on user model as array of product IDs
// We add a wishlist field on the fly. For simplicity, store in User via a separate lightweight schema.

const mongoose = require('mongoose');
const User = require('../models/User');

// Add wishlist field support (patch schema)
// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      model: 'Product',
      select: 'name price images rating category sellerName',
    });
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/wishlist/:productId
router.post('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid  = req.params.productId;
    if (!user.wishlist) user.wishlist = [];
    const idx = user.wishlist.findIndex(id => id.toString() === pid);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    }
    user.wishlist.push(pid);
    await user.save();
    res.json({ success: true, action: 'added', message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
