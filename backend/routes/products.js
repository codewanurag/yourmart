const express  = require('express');
const router   = express.Router();
const Product  = require('../models/Product');
const { protect, sellerOnly } = require('../middleware/auth');

// GET /api/products  — list with filter/search
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.$text = { $search: search };

    const sortOptions = {
      newest:  { createdAt: -1 },
      oldest:  { createdAt:  1 },
      'price-low':  { price:  1 },
      'price-high': { price: -1 },
      rating:  { rating: -1 },
    };

    const products = await Product.find(query)
      .populate('seller', 'name sellerInfo avatar')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ success: true, products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name sellerInfo avatar')
      .populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products  (seller only)
router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, images, stock, tags } = req.body;
    const user = req.user;
    const product = await Product.create({
      seller: user._id,
      sellerName: user.sellerInfo?.storeName || user.name,
      sellerVerified: true,
      name, description, price, originalPrice, category,
      images: images || [],
      stock:  stock  || 0,
      tags:   tags   || [],
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id  (seller only)
router.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id  (seller only)
router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: 'Not found or unauthorized' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.updateRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/seller/my-products  (seller only)
router.get('/seller/my-products', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
