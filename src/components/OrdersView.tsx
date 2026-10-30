import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/sqlDatabase';
import { Order } from '../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Printer,
  Star,
  MessageSquare
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onRefreshData: () => void;
  onExploreProduce: () => void;
  onOpenReview: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onRefreshData,
  onExploreProduce,
  onOpenReview
}) => {
  const { currentUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for the logged in consumer (or all if admin)
  const userOrders = currentUser?.role === 'admin'
    ? orders
    : orders.filter(o => o.consumer_id === currentUser?.id);

  const handleReleaseEscrow = (orderId: number) => {
    if (window.confirm('Confirm that you have received and verified the harvest quality? This will release the escrow payout directly to the farmer.')) {
      db.releaseEscrow(orderId);
      db.updateOrderStatus(orderId, 'delivered');
      onRefreshData();
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = db.getAllOrders().find(o => o.id === orderId);
        setSelectedOrder(updated || null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <span>Direct Consumer Orders</span>
            <span aria-hidden="true">·</span>
            <span>Escrow Protected</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Order History & Real-Time Tracking
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Track farm harvests from soil picking to your doorstep with live milestones, escrow guarantees, and verified reviews.
          </p>
        </div>

        <button
          onClick={onExploreProduce}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          Explore Fresh Farm Marketplace
        </button>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-display text-base font-bold text-stone-900">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Support local farmers directly by ordering fresh organic vegetables, golden grains, or seasonal fruits.
          </p>
          <button
            onClick={onExploreProduce}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 cursor-pointer"
          >
            Browse Today's Fresh Harvest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-5 space-y-4">
            {userOrders.map(order => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="font-mono font-bold text-stone-900 text-xs">
                      {order.order_number}
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="py-3 space-y-1.5 text-xs">
                    <div className="text-stone-600">
                      Farmer: <strong className="text-stone-800">{order.farmer_name}</strong>
                    </div>
                    <div className="text-stone-500 text-[11px] truncate">
                      {order.items?.map(it => `${it.crop_name} (${it.quantity_kg}kg)`).join(', ')}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-stone-500 tabular-nums text-[11px]">{order.order_date}</span>
                      <span className="font-bold text-stone-900 text-sm tabular-nums">
                        ₹{order.total_amount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span>View tracking & review</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details & Live Timeline */}
          <div className="lg:col-span-7">
            {(() => {
              const active = selectedOrder || userOrders[0];
              if (!active) return null;

              return (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Top strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                    <div>
                      <div className="font-mono text-sm font-bold text-stone-900">
                        {active.order_number}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Placed on {active.order_date} · Fulfiller: {active.farmer_name}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                        active.payment_status === 'released'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Escrow: {active.payment_status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Real-Time Stepper Timeline */}
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
                      Real-Time Harvest & Delivery Timeline
                    </h3>

                    <div className="relative pl-6 space-y-6 border-l-2 border-stone-200 ml-2">
                      {active.tracking_steps?.map((step, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot */}
                          <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                            step.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-stone-300'
                          }`}>
                            {step.completed && <CheckCircle2 className="w-3 h-3 fill-current text-white" />}
                          </div>

                          <div className="text-xs">
                            <div className="flex items-center justify-between">
                              <span className={`font-bold ${
                                step.completed ? 'text-stone-900' : 'text-stone-400'
                              }`}>
                                {step.title}
                              </span>
                              <span className="text-[11px] text-stone-500 tabular-nums">
                                {step.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchased Line Items */}
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Purchased Harvest Items
                    </h4>
                    <div className="divide-y divide-stone-100 text-xs">
                      {active.items?.map(it => (
                        <div key={it.id} className="py-2 flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-stone-900">{it.crop_name}</span>
                            <span className="text-stone-500 text-[11px] ml-2">
                              {it.quantity_kg} kg @ ₹{it.unit_price}/kg
                            </span>
                          </div>
                          <span className="font-bold text-stone-900 tabular-nums">
                            ₹{it.subtotal}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 flex justify-between font-bold text-sm text-stone-900">
                        <span>Grand Total (incl. freight & escrow):</span>
                        <span className="text-emerald-700 tabular-nums">₹{active.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Escrow Action */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <div className="text-stone-600">
                      <strong>Delivery Address:</strong> {active.shipping_address}
                    </div>

                    {active.payment_status === 'escrow_held' ? (
                      <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-stone-500 text-[11px]">
                          Produce arrived in good condition? Release funds to the grower.
                        </div>
                        <button
                          onClick={() => handleReleaseEscrow(active.id)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Confirm Quality & Release Escrow to Farmer</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-stone-200 text-emerald-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Escrow released and credited to {active.farmer_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Review & Rating Section for this order */}
                  <div className="bg-amber-50/60 border border-amber-200/70 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span>Farmer Rating & Quality Feedback</span>
                      </div>
                      <div className="text-stone-600 text-[11px] mt-0.5">
                        Help other consumers and reward organic growers with your review.
                      </div>
                    </div>

                    {active.has_reviewed ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-100/70 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Review Submitted</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenReview(active)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Rate & Review Farmer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
