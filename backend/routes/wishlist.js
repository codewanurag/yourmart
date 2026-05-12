const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price images rating category seller sellerName',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (err) {
    console.error('Wishlist GET error:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// POST /api/wishlist/:productId
router.post('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );

      await user.save();

      return res.json({
        success: true,
        action: 'removed',
        message: 'Removed from wishlist',
        wishlist: user.wishlist,
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.json({
      success: true,
      action: 'added',
      message: 'Added to wishlist',
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.error('Wishlist POST error:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;