'use client';

import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  _id: string; orderNumber: string; totalAmount: number;
  status: string; createdAt: string; items: OrderItem[]; notes?: string;
}
interface CustomerRecord {
  phone: string; name: string; email: string; orders: Order[];
  totalSpent: number; lastOrderAt: string; firstOrderAt: string;
}

const AVATAR_COLORS = ['#16a34a','#2563eb','#dc2626','#d97706','#7c3aed','#db2777','#0891b2','#65a30d'];
const STATUS_STYLES: Record<string,string> = {
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  ready_for_collection: 'bg-green-50 text-green-700 border border-green-200',
  collected: 'bg-purple-50 text-purple-700 border border-purple-200',
  delivered: 'bg-gray-100 text-gray-500 border border-gray-200',
};
const STATUS_LABELS: Record<string,string> = {
  pending:'Pending', confirmed:'Confirmed', ready_for_collection:'Ready',
  collected:'Collected', delivered:'Delivered',
};

type FilterTab = 'all' | 'repeat' | 'new';

export default function UsersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'most_spent' | 'most_orders'>('latest');

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      if (!data.success) return;
      const map = new Map<string, CustomerRecord>();
      for (const order of data.data) {
        const phone = order.customerPhone;
        if (!map.has(phone)) {
          map.set(phone, { phone, name: order.customerName, email: order.customerEmail || '',
            orders: [], totalSpent: 0, lastOrderAt: order.createdAt, firstOrderAt: order.createdAt });
        }
        const rec = map.get(phone)!;
        rec.orders.push(order);
        if (order.status === 'delivered') rec.totalSpent += order.totalAmount;
        if (new Date(order.createdAt) > new Date(rec.lastOrderAt)) rec.lastOrderAt = order.createdAt;
        if (new Date(order.createdAt) < new Date(rec.firstOrderAt)) rec.firstOrderAt = order.createdAt;
      }
      setCustomers(Array.from(map.values())
        .sort((a,b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()));
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const repeatCustomers = customers.filter(c => c.orders.length > 1);
  const newCustomers = customers.filter(c => c.orders.length === 1);
  const topSpender = customers.reduce((top, c) => c.totalSpent > (top?.totalSpent ?? 0) ? c : top, null as CustomerRecord | null);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchTab = filterTab === 'all' || (filterTab === 'repeat' && c.orders.length > 1) || (filterTab === 'new' && c.orders.length === 1);

    // Date filter — customer must have at least one order within the date range
    let matchDate = true;
    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      matchDate = c.orders.some(o => {
        const d = new Date(o.createdAt);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    }

    return matchSearch && matchTab && matchDate;
  }).sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime();
    if (sortBy === 'oldest') return new Date(a.firstOrderAt).getTime() - new Date(b.firstOrderAt).getTime();
    if (sortBy === 'most_spent') return b.totalSpent - a.totalSpent;
    if (sortBy === 'most_orders') return b.orders.length - a.orders.length;
    return 0;
  });

  const avgOrderValue = (c: CustomerRecord) => c.orders.length > 0 ? c.totalSpent / c.orders.filter(o => o.status === 'delivered').length || 0 : 0;
  const favouriteItem = (c: CustomerRecord) => {
    const freq = new Map<string,number>();
    c.orders.forEach(o => o.items.forEach(i => freq.set(i.name, (freq.get(i.name) ?? 0) + i.quantity)));
    let top = ''; let max = 0;
    freq.forEach((v, k) => { if (v > max) { max = v; top = k; } });
    return top;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Full customer profiles with order history and spending insights</p>
        </div>
        <button onClick={() => { setLoading(true); fetchCustomers(); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors shadow-sm">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-5">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">🔁 Repeat</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{repeatCustomers.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {customers.length > 0 ? Math.round((repeatCustomers.length / customers.length) * 100) : 0}% of total
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">New (1 order)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{newCustomers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-5">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">🏆 Top Spender</p>
          {topSpender ? (
            <>
              <p className="text-base font-bold text-gray-900 mt-1 truncate">{topSpender.name}</p>
              <p className="text-xs text-green-600 font-semibold">AED {topSpender.totalSpent.toFixed(2)}</p>
            </>
          ) : <p className="text-gray-400 text-sm mt-1">—</p>}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        {/* Row 1: search + customer type tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search name, phone or email..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent" />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(['all','repeat','new'] as FilterTab[]).map(tab => (
              <button key={tab} onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  filterTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'repeat' ? '🔁 Repeat' : tab === 'new' ? '✨ New' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: date range + sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Date From */}
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full text-sm text-gray-700 focus:outline-none bg-transparent" />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full text-sm text-gray-700 focus:outline-none bg-transparent" />
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm text-gray-600 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="latest">Latest Order</option>
            <option value="oldest">Oldest Customer</option>
            <option value="most_spent">Most Spent</option>
            <option value="most_orders">Most Orders</option>
          </select>

          {/* Clear filters */}
          {(dateFrom || dateTo || search || filterTab !== 'all' || sortBy !== 'latest') && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setSearch(''); setFilterTab('all'); setSortBy('latest'); }}
              className="px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active filter summary */}
        {(dateFrom || dateTo) && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              Showing customers with orders
              {dateFrom && <> from <span className="font-semibold text-gray-700">{new Date(dateFrom).toLocaleDateString()}</span></>}
              {dateTo && <> to <span className="font-semibold text-gray-700">{new Date(dateTo).toLocaleDateString()}</span></>}
              {' '}· <span className="font-semibold text-green-600">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </span>
          </div>
        )}
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-gray-500">No customers found</p>
          <p className="text-xs text-gray-400 mt-1">Customers appear here once orders are placed</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Spent</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Last Order</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((customer, idx) => {
                const isRepeat = customer.orders.length > 1;
                const fav = favouriteItem(customer);
                return (
                  <tr key={customer.phone} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          {isRepeat && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold" title="Repeat customer">↩</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {customer.name}
                            {isRepeat && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-200">REPEAT</span>}
                          </p>
                          <p className="text-xs text-gray-400 sm:hidden">{customer.phone}</p>
                          <p className="text-xs text-gray-400">Since {new Date(customer.firstOrderAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">{customer.phone}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {customer.email
                        ? <span className="text-sm text-gray-600">{customer.email}</span>
                        : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${isRepeat ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {customer.orders.length}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-bold text-green-700">AED {customer.totalSpent.toFixed(2)}</p>
                    </td>
                    <td className="px-5 py-4 text-right hidden lg:table-cell text-xs text-gray-500">
                      {new Date(customer.lastOrderAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-200 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    {selectedCustomer.name}
                    {selectedCustomer.orders.length > 1 && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200">REPEAT CUSTOMER</span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCustomer.orders.length}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Spent</p>
                <p className="text-xl font-bold text-green-700">AED {selectedCustomer.totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Avg Order</p>
                <p className="text-xl font-bold text-gray-900">AED {avgOrderValue(selectedCustomer).toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Customer Since</p>
                <p className="text-sm font-bold text-gray-900">{new Date(selectedCustomer.firstOrderAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Email */}
            {selectedCustomer.email && (
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              </div>
            )}

            {/* Order History */}
            <div className="px-6 py-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Order History ({selectedCustomer.orders.length})
              </p>
              {selectedCustomer.orders
                .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-500'}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                        <p className="font-bold text-gray-900">AED {order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.quantity}x {item.name}</span>
                          <span className="text-gray-500">AED {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.notes && <p className="text-xs text-amber-600 italic">📝 {order.notes}</p>}
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    </p>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
