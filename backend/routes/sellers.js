// ─── sellers.js ───────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const Product  = require('../models/Product');
const Order    = require('../models/Order');
const { protect } = require('../middleware/auth');

// GET /api/sellers — all sellers
router.get('/', async (req, res) => {
  try {
    const sellers = await User.find({ isSeller: true }).select('-password -notifications');
    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// GET /api/sellers/nearby?city=Bhopal
router.get('/nearby', async (req, res) => {
  try {
    const city = (req.query.city || '').trim();

    const filter = { isSeller: true };

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    const sellers = await User.find(filter)
      .select('-password -notifications')
      .sort({ createdAt: -1 });

    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// GET /api/sellers/:id
router.get('/:id', async (req, res) => {
  try {
    const seller   = await User.findById(req.params.id).select('-password -notifications');
    const products = await Product.find({ seller: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, seller, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sellers/dashboard/stats (seller only)
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    const myProductIds = products.map(p => p._id);
    const orders = await Order.find({ 'items.product': { $in: myProductIds } });

    let revenue = 0;
    let totalOrders = orders.length;
    orders.forEach(o => { revenue += o.totalPrice; });

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders,
        revenue,
        totalViews: products.reduce((s, p) => s + (p.numReviews * 10), 0),
        recentOrders: orders.slice(0, 5),
        products: products.slice(0, 10),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sellers/follow/:id
router.post('/follow/:id', protect, async (req, res) => {
  try {
    const targetId = req.params.id;
    const me = await User.findById(req.user._id);
    const idx = me.following.indexOf(targetId);
    if (idx > -1) {
      me.following.splice(idx, 1);
      await User.findByIdAndUpdate(targetId, { $pull: { followers: me._id } });
      await me.save();
      return res.json({ success: true, action: 'unfollowed' });
    }
    me.following.push(targetId);
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: me._id } });
    await me.save();
    res.json({ success: true, action: 'followed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
