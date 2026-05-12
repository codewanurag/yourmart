const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');
const { protect } = require('../middleware/auth');

/* ══════════════ CART (stored per-user in DB) ══════════════ */
// We store cart in memory (client-side) — the backend handles orders
// Cart endpoints just validate products and return up-to-date prices

// POST /api/cart/validate
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, qty }]
    const results = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        results.push({
          productId: product._id,
          name:  product.name,
          price: product.price,
          image: product.images[0] || '',
          stock: product.stock,
          available: product.stock >= item.qty,
        });
      }
    }
    res.json({ success: true, items: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
