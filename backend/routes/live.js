const express = require('express');
const router  = express.Router();
const { LiveSession } = require('../models/LiveSession');
const { protect, sellerOnly } = require('../middleware/auth');

// GET /api/live — active sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await LiveSession.find({ isLive: true })
      .populate('seller', 'name sellerInfo avatar')
      .populate('products', 'name price images')
      .sort({ viewers: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/live/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .populate('seller', 'name sellerInfo avatar')
      .populate('products', 'name price images description');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/live — start a session (seller only)
router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const { title, description, category, products, thumbnail, videoUrl } = req.body;
    const session = await LiveSession.create({
      seller: req.user._id,
      title, description, category,
      products: products || [],
      thumbnail: thumbnail || '',
      videoUrl:  videoUrl  || '',
      viewers: Math.floor(Math.random() * 500) + 100,
    });
    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/live/:id/end — end session
router.put('/:id/end', protect, sellerOnly, async (req, res) => {
  try {
    const session = await LiveSession.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      { isLive: false, endedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/live/:id/chat — add a chat message
router.post('/:id/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const session = await LiveSession.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          chatMessages: {
            user: req.user._id,
            name: req.user.name,
            message,
          },
        },
        $inc: { viewers: 0 },
      },
      { new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
