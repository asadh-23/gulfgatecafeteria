'use client';

import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RevenueRecord {
  _id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  itemsSummary: { name: string; quantity: number; price: number }[];
  totalItems: number;
  collectedAt: string;
}

interface ChartPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface Summary {
  totalRevenue: number;
  totalOrders: number;
  todayRevenue: number;
  todayOrders: number;
  monthRevenue: number;
  monthOrders: number;
  yearRevenue: number;
  yearOrders: number;
  daily: ChartPoint[];
  monthly: ChartPoint[];
  yearly: ChartPoint[];
}

type Period = 'daily' | 'monthly' | 'yearly';

// ── Simple bar chart component ─────────────────────────────────────────────
function BarChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-2 h-40 pt-4">
      {data.map((point, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
          {/* Tooltip */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none mb-1 text-center">
            <p className="font-bold">AED {point.revenue.toFixed(2)}</p>
            <p className="text-gray-300">{point.orders} orders</p>
          </div>
          {/* Bar */}
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500 min-h-[4px] hover:from-green-500 hover:to-green-300"
            style={{ height: `${Math.max((point.revenue / max) * 120, 4)}px` }}
          />
          {/* Label */}
          <p className="text-[10px] text-gray-500 text-center truncate w-full mt-1 leading-tight">
            {point.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function RevenuePage() {
  const [records, setRecords] = useState<RevenueRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<Period>('daily');
  const [chartView, setChartView] = useState<Period>('daily');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recRes, sumRes] = await Promise.all([
        fetch(`${API}/api/revenue?period=${period}`),
        fetch(`${API}/api/revenue/summary`),
      ]);
      const recData = await recRes.json();
      const sumData = await sumRes.json();
      if (recData.success) setRecords(recData.data);
      if (sumData.success) setSummary(sumData.data);
    } catch (err) {
      console.error('Failed to fetch revenue:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.orderNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.toLowerCase().includes(q)
    );
  });

  const avg = summary && summary.totalOrders > 0
    ? summary.totalRevenue / summary.totalOrders
    : 0;

  const periodStats = {
    daily:   { revenue: summary?.todayRevenue ?? 0,  orders: summary?.todayOrders ?? 0,  label: 'Today' },
    monthly: { revenue: summary?.monthRevenue ?? 0,  orders: summary?.monthOrders ?? 0,  label: 'This Month' },
    yearly:  { revenue: summary?.yearRevenue ?? 0,   orders: summary?.yearOrders ?? 0,   label: 'This Year' },
  };

  const chartData = {
    daily:   summary?.daily ?? [],
    monthly: summary?.monthly ?? [],
    yearly:  summary?.yearly ?? [],
  };

  const PERIOD_TABS: { label: string; value: Period }[] = [
    { label: 'Today', value: 'daily' },
    { label: 'This Month', value: 'monthly' },
    { label: 'This Year', value: 'yearly' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
          <p className="text-sm text-gray-500 mt-1">Track earnings by daily, monthly and yearly periods</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Period Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PERIOD_TABS.map(({ label, value }) => (
          <div
            key={value}
            onClick={() => { setPeriod(value); setChartView(value); }}
            className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
              period === value ? 'border-green-500 shadow-sm' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-bold uppercase tracking-wider ${period === value ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </p>
              {period === value && (
                <span className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              AED {periodStats[value].revenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {periodStats[value].orders} order{periodStats[value].orders !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Time</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">AED {summary?.totalRevenue.toFixed(2) ?? '0.00'}</p>
          <p className="text-xs text-gray-400 mt-1">{summary?.totalOrders ?? 0} total orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Order</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">AED {avg.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Per collected order</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">This Month</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">AED {summary?.monthRevenue.toFixed(2) ?? '0.00'}</p>
          <p className="text-xs text-gray-400 mt-1">{summary?.monthOrders ?? 0} orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">This Year</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">AED {summary?.yearRevenue.toFixed(2) ?? '0.00'}</p>
          <p className="text-xs text-gray-400 mt-1">{summary?.yearOrders ?? 0} orders</p>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">Revenue Chart</h2>
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {PERIOD_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setChartView(value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  chartView === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {summary ? (
          <>
            <BarChart data={chartData[chartView]} />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
              <span>
                {chartView === 'daily' ? 'Last 7 days' : chartView === 'monthly' ? 'Last 6 months' : 'Last 3 years'}
              </span>
              <span className="font-semibold text-green-600">
                Total: AED {chartData[chartView].reduce((s, d) => s + d.revenue, 0).toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Records Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header with period filter */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-2 flex-1">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by order number, customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5 flex-shrink-0">
            {PERIOD_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  period === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-500">No records for this period</p>
            <p className="text-xs text-gray-400 mt-1">Records appear when orders are marked as collected</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Collected At</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">#{record.orderNumber}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{record.customerName}</p>
                      <p className="text-xs text-gray-400">{record.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {record.itemsSummary.map((item, i) => (
                          <p key={i} className="text-xs text-gray-600">
                            {item.quantity}x {item.name} — AED {item.price.toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700">{new Date(record.collectedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{new Date(record.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-bold text-green-700 text-base">AED {record.amount.toFixed(2)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50 border-t-2 border-green-200">
                  <td colSpan={4} className="px-5 py-3 text-sm font-bold text-gray-700">
                    Total ({filtered.length} records)
                  </td>
                  <td className="px-5 py-3 text-right">
                    <p className="font-bold text-green-700 text-base">
                      AED {filtered.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                    </p>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
