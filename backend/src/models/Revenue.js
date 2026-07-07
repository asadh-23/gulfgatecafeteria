const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema(
  {
    // Reference to the original order
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    orderNumber: {
      type: String,
      required: true,
    },

    // Customer info (copied for record keeping)
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },

    // Revenue amount in AED
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Summary of items ordered
    itemsSummary: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    // Total items count
    totalItems: {
      type: Number,
      required: true,
    },

    // Date the revenue was recorded (when order was collected)
    collectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Revenue', revenueSchema);
