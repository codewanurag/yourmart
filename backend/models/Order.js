const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      address:  String,
      city:     String,
      state:    String,
      pincode:  String,
      phone:    String,
    },
    paymentMethod: { type: String, default: 'COD' },
    paymentResult: {
      id: String, status: String, update_time: String, email_address: String,
    },
    subtotal:      { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    taxPrice:      { type: Number, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid:      { type: Boolean, default: false },
    paidAt:      { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    trackingNumber: { type: String, default: '' },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
