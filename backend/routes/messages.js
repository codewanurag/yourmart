const express = require('express');
const router  = express.Router();
const { Message, Conversation } = require('../models/LiveSession');
const { protect } = require('../middleware/auth');

// GET /api/messages/conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar sellerInfo')
      .sort({ lastMessageAt: -1 });
    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/messages/:conversationId
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    // Mark as read
    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/messages/start — start or get conversation
router.post('/start', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;
    let conv = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    });
    if (!conv) {
      conv = await Conversation.create({ participants: [req.user._id, recipientId] });
    }
    const populated = await conv.populate('participants', 'name avatar sellerInfo');
    res.json({ success: true, conversation: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/messages/:conversationId
router.post('/:conversationId', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user._id,
      content,
    });
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });
    const populated = await message.populate('sender', 'name avatar');
    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
