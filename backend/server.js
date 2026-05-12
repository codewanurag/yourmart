const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://yourmart2-git-main-anurag-chouhan-s-projects.vercel.app',
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/wishlist',   require('./routes/wishlist'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/live',       require('./routes/live'));
app.use('/api/sellers',    require('./routes/sellers'));
app.use('/api/messages',   require('./routes/messages'));

// ─── Health check ─────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', message: 'YourMart API is running 🚀' }));

// ─── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Database + Start ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
