const Order = require('../models/Order');
const Revenue = require('../models/Revenue');

// ─── Create Order ────────────────────────────────────────────────────────────
// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, items, totalAmount, notes } = req.body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Name, phone and items are required' });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      items,
      totalAmount,
      notes: notes || '',
      status: 'pending',
      // Notify user immediately that their order was received
      notifications: [
        {
          type: 'order_received',
          message: `✅ Order received! We've got your order and will start preparing it soon.`,
          isRead: false,
          createdAt: new Date(),
        },
      ],
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Orders by Phone (user's own orders) ─────────────────────────────────
// GET /api/orders/mine?phone=05xxxxxxxx
exports.getUserOrders = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

    const orders = await Order.find({ customerPhone: phone }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Notifications for user ──────────────────────────────────────────────
// GET /api/orders/notifications?phone=05xxxxxxxx
exports.getNotifications = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

    const orders = await Order.find({ customerPhone: phone });
    const notifications = [];

    orders.forEach((order) => {
      order.notifications.forEach((n) => {
        notifications.push({
          _id: n._id,
          orderId: order._id,
          orderNumber: order.orderNumber,
          type: n.type || 'general',
          message: n.message,
          isRead: n.isRead,
          createdAt: n.createdAt,
        });
      });
    });

    // Sort newest first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Mark Notifications as Read ──────────────────────────────────────────────
// POST /api/orders/notifications/read?phone=05xxxxxxxx
exports.markNotificationsRead = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

    await Order.updateMany(
      { customerPhone: phone },
      { $set: { 'notifications.$[].isRead': true } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
// GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Single Order by ID (Admin) ──────────────────────────────────────────
// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Update Order Status (Admin) ─────────────────────────────────────────────
// PATCH /api/orders/:id/status
// PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'ready_for_collection', 'collected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const prevStatus = order.status;
    order.status = status;

    // When food is ready → notify user
    if (status === 'ready_for_collection' && prevStatus !== 'ready_for_collection') {
      order.notifications.push({
        type: 'order_ready',
        message: `🎉 Your order #${order.orderNumber} is ready for collection! Please come pick it up.`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    // When collected → record revenue and auto-complete
    if (status === 'collected') {
      // Record revenue if not already done
      if (!order.revenueRecorded) {
        try {
          await Revenue.create({
            orderId: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            amount: order.totalAmount,
            itemsSummary: order.items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            totalItems: order.items.reduce((sum, i) => sum + i.quantity, 0),
            collectedAt: new Date(),
          });
          order.revenueRecorded = true;
        } catch (revenueErr) {
          console.error('Revenue recording failed (non-critical):', revenueErr);
          // Continue anyway - don't block order completion
        }
      }
      
      // Thank you notification
      order.notifications.push({
        type: 'general',
        message: `🙏 Thank you for your order #${order.orderNumber}! We hope you enjoy your meal. Looking forward to serving you again! 😊`,
        isRead: false,
        createdAt: new Date(),
      });

      // Automatically set to completed
      order.status = 'completed';
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
