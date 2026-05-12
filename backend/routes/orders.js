const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders — create new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Calculate prices fresh from DB
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      orderItems.push({
        product: product._id,
        name:    product.name,
        image:   product.images[0] || '',
        price:   product.price,
        qty:     item.qty,
      });
      subtotal += product.price * item.qty;
      // Decrement stock
      product.stock = Math.max(0, product.stock - item.qty);
      await product.save();
    }

    const shippingPrice = subtotal > 999 ? 0 : 49;
    const taxPrice      = Math.round(subtotal * 0.18);
    const totalPrice    = subtotal + shippingPrice + taxPrice;

    // Estimated delivery: 5-7 days
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: 'confirmed',
      trackingNumber: 'YM' + Date.now().toString().slice(-8),
      estimatedDelivery,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders — my orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/seller/all — seller sees their orders
router.get('/seller/all', protect, async (req, res) => {
  try {
    // Find orders that contain products sold by this seller
    const myProducts = await Product.find({ seller: req.user._id }).select('_id');
    const myProductIds = myProducts.map(p => p._id);
    const orders = await Order.find({ 'items.product': { $in: myProductIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status — seller updates status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
