const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    // Customer info (no auth required — guest ordering)
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },

    // Order items
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },

    // Total in AED
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order status flow:
    // pending → confirmed → ready_for_collection → collected → delivered
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ready_for_collection', 'collected', 'delivered'],
      default: 'pending',
    },

    // Notifications sent to user
    notifications: [
      {
        type: { type: String, enum: ['order_received', 'order_ready', 'general'], default: 'general' },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Order number for display (auto-generated)
    orderNumber: {
      type: String,
      unique: true,
    },

    // Notes from customer
    notes: {
      type: String,
      default: '',
    },

    // Revenue recorded flag
    revenueRecorded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `GGC-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
