const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '' },
    location: { type: String, default: '' },
    phone:    { type: String, default: '' },
    isSeller: { type: Boolean, default: false },
    sellerInfo: {
      storeName:   { type: String, default: '' },
      storeTag:    { type: String, default: '' },
      storeDesc:   { type: String, default: '' },
      rating:      { type: Number, default: 0 },
      totalSales:  { type: Number, default: 0 },
      revenue:     { type: Number, default: 0 },
    },
    following:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notifications:[{
      message: String,
      type:    { type: String, enum: ['order','live','message','follow'], default: 'order' },
      read:    { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
