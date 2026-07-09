'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/src/components/ToastContainer';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      
      const data = await response.json();
      if (data.success) {
        const updatedOrder = data.data;
        setOrder(updatedOrder);
        
        // Show success toast
        const statusLabels: Record<string, string> = {
          confirmed: 'Order confirmed successfully!',
          ready_for_collection: 'Order marked as ready for collection!',
          collected: 'Order collected and completed successfully!',
          completed: 'Order completed successfully!',
        };
        
        showToast(statusLabels[newStatus] || 'Order status updated!', 'success');
        
        // If order is now completed, redirect back to orders list after a delay
        if (updatedOrder.status === 'completed') {
          setTimeout(() => {
            router.push('/orders');
          }, 2000);
        }
      } else {
        showToast(data.message || 'Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Order not found</p>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300' },
    confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' },
    ready_for_collection: { label: 'Ready for Collection', color: 'text-green-700', bg: 'bg-green-100 border-green-300' },
    collected: { label: 'Collected', color: 'text-purple-700', bg: 'bg-purple-100 border-purple-300' },
    completed: { label: 'Completed', color: 'text-gray-700', bg: 'bg-gray-100 border-gray-300' },
  };

  const currentStatusConfig = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-lg border font-semibold ${currentStatusConfig.bg} ${currentStatusConfig.color}`}>
          {currentStatusConfig.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">AED {item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-bold text-gray-900">AED {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-[#FFC107]">AED {order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Special Instructions</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-800">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Order Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus('confirmed')}
                  disabled={updating}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  ✓ Confirm Order
                </button>
              )}
              
              {(order.status === 'confirmed' || order.status === 'pending') && (
                <button
                  onClick={() => updateOrderStatus('ready_for_collection')}
                  disabled={updating}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  🔔 Ready for Collection
                </button>
              )}
              
              {order.status === 'ready_for_collection' && (
                <button
                  onClick={() => updateOrderStatus('collected')}
                  disabled={updating}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 col-span-2"
                >
                  {updating ? 'Updating...' : '📦 Mark as Collected & Complete'}
                </button>
              )}
              
              {order.status === 'collected' && (
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">✓ Order has been collected and completed</p>
                </div>
              )}
              
              {order.status === 'completed' && (
                <div className="col-span-2 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700">✓ Order completed successfully</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                <p className="font-semibold text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <a href={`tel:${order.customerPhone}`} className="font-semibold text-blue-600 hover:underline">
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${order.customerEmail}`} className="font-semibold text-blue-600 hover:underline text-sm">
                    {order.customerEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                <p className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-gray-900">{new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">💳</span>
                <span>Cash or Card on Collection</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">🏪</span>
                <span>Collection Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
