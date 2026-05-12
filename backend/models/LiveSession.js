const mongoose = require('mongoose');

// ─── Live Session ──────────────────────────────────────────
const liveSessionSchema = new mongoose.Schema(
  {
    seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:    { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    videoUrl:  { type: String, default: '' },
    category: { type: String, default: 'Fashion' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    viewers:  { type: Number, default: 0 },
    peakViewers: { type: Number, default: 0 },
    isLive:   { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
    endedAt:   { type: Date },
    chatMessages: [{
      user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name:    String,
      message: String,
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

// ─── Message ───────────────────────────────────────────────
const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage:  { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount:  { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const LiveSession   = mongoose.model('LiveSession', liveSessionSchema);
const Message       = mongoose.model('Message', messageSchema);
const Conversation  = mongoose.model('Conversation', conversationSchema);

module.exports = { LiveSession, Message, Conversation };
