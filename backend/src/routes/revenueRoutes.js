const express = require('express');
const router = express.Router();
const Revenue = require('../models/Revenue');

// GET /api/revenue — All records (with optional ?period=daily|monthly|yearly filter)
router.get('/', async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const now = new Date();

    if (period === 'daily') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const filter = startDate ? { collectedAt: { $gte: startDate } } : {};
    const records = await Revenue.find(filter).sort({ collectedAt: -1 });
    const total = records.reduce((sum, r) => sum + r.amount, 0);
    res.json({ success: true, data: records, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/revenue/summary — Full summary with daily/monthly/yearly breakdowns
router.get('/summary', async (req, res) => {
  try {
    const all = await Revenue.find().sort({ collectedAt: 1 });
    const now = new Date();

    // ── Today ──
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayRecords = all.filter((r) => new Date(r.collectedAt) >= todayStart);

    // ── This Month ──
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthRecords = all.filter((r) => new Date(r.collectedAt) >= monthStart);

    // ── This Year ──
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearRecords = all.filter((r) => new Date(r.collectedAt) >= yearStart);

    // ── Daily breakdown for last 7 days ──
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const recs = all.filter((r) => {
        const c = new Date(r.collectedAt);
        return c >= d && c < next;
      });
      daily.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: recs.reduce((sum, r) => sum + r.amount, 0),
        orders: recs.length,
      });
    }

    // ── Monthly breakdown for last 6 months ──
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const recs = all.filter((r) => {
        const c = new Date(r.collectedAt);
        return c >= d && c < next;
      });
      monthly.push({
        label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: recs.reduce((sum, r) => sum + r.amount, 0),
        orders: recs.length,
      });
    }

    // ── Yearly breakdown for last 3 years ──
    const yearly = [];
    for (let i = 2; i >= 0; i--) {
      const yr = now.getFullYear() - i;
      const d = new Date(yr, 0, 1);
      const next = new Date(yr + 1, 0, 1);
      const recs = all.filter((r) => {
        const c = new Date(r.collectedAt);
        return c >= d && c < next;
      });
      yearly.push({
        label: String(yr),
        revenue: recs.reduce((sum, r) => sum + r.amount, 0),
        orders: recs.length,
      });
    }

    res.json({
      success: true,
      data: {
        totalRevenue: all.reduce((sum, r) => sum + r.amount, 0),
        totalOrders: all.length,
        todayRevenue: todayRecords.reduce((sum, r) => sum + r.amount, 0),
        todayOrders: todayRecords.length,
        monthRevenue: monthRecords.reduce((sum, r) => sum + r.amount, 0),
        monthOrders: monthRecords.length,
        yearRevenue: yearRecords.reduce((sum, r) => sum + r.amount, 0),
        yearOrders: yearRecords.length,
        daily,
        monthly,
        yearly,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
