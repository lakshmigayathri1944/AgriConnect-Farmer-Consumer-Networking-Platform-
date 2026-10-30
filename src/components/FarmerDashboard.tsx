import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/sqlDatabase';
import { Crop, Order, CropInquiry, CropCategory, Review } from '../types';
import {
  PlusCircle,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  DollarSign,
  AlertCircle,
  Edit2,
  Trash2,
  Calendar,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  Star
} from 'lucide-react';

interface FarmerDashboardProps {
  crops: Crop[];
  orders: Order[];
  inquiries: CropInquiry[];
  onRefreshData: () => void;
  onOpenSqlConsole: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  crops,
  orders,
  inquiries,
  onRefreshData,
  onOpenSqlConsole
}) => {
  const { currentUser, farmerProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'bids' | 'reviews'>('inventory');
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);

  // Form state for new crop
  const [newCropName, setNewCropName] = useState('');
  const [newCategory, setNewCategory] = useState<CropCategory>('Vegetables');
  const [newVariety, setNewVariety] = useState('');
  const [newPrice, setNewPrice] = useState<number>(45);
  const [newStock, setNewStock] = useState<number>(200);
  const [newHarvestDate, setNewHarvestDate] = useState(new Date().toISOString().substring(0, 10));
  const [newShelfLife, setNewShelfLife] = useState<number>(7);
  const [newOrganic, setNewOrganic] = useState(true);
  const [newMinOrder, setNewMinOrder] = useState<number>(2);
  const [newDescription, setNewDescription] = useState('');

  // Editing state
  const [editingCropId, setEditingCropId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Filter crops owned by this farmer
  const currentFarmerId = farmerProfile ? farmerProfile.id : 1;
  const farmerCrops = crops.filter(c => c.farmer_id === currentFarmerId);
  const farmerOrders = orders.filter(o => o.farmer_id === currentFarmerId);
  const farmerInquiries = inquiries.filter(i => i.farmer_id === currentFarmerId);
  const farmerReviews = db.getFarmerReviews(currentFarmerId);

  // Average Rating
  const avgRating = farmerReviews.length > 0
    ? (farmerReviews.reduce((sum, r) => sum + r.rating, 0) / farmerReviews.length).toFixed(1)
    : (farmerProfile?.rating?.toFixed(1) || '5.0');

  // Rating breakdown counts
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  farmerReviews.forEach(r => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

  // Financial aggregates
  const totalRevenue = farmerOrders.reduce((sum, ord) => sum + ord.total_amount, 0);
  const escrowPending = farmerOrders
    .filter(ord => ord.payment_status === 'escrow_held')
    .reduce((sum, ord) => sum + ord.total_amount, 0);
  const totalKgSold = farmerOrders.reduce((sum, ord) => {
    return sum + (ord.items?.reduce((iSum, it) => iSum + it.quantity_kg, 0) || 0);
  }, 0);

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;

    // Pick image matching category
    let chosenImg = '/src/assets/images/crop_fresh_produce_basket_1793338568630.jpg';
    if (newCategory === 'Grains' || newCategory === 'Pulses') {
      chosenImg = '/src/assets/images/crop_golden_wheat_grains_1793338569436.jpg';
    } else if (newCategory === 'Fruits') {
      chosenImg = '/src/assets/images/crop_organic_alphonso_mangoes_1793338569448.jpg';
    }

    db.addCrop({
      farmer_id: currentFarmerId,
      farmer_name: currentUser?.full_name || 'Ramesh Patel',
      farm_name: farmerProfile?.farm_name || 'GreenValley Organic Sanctuary',
      location: farmerProfile?.farm_location || 'Karjat, Maharashtra',
      crop_name: newCropName.trim(),
      category: newCategory,
      variety: newVariety.trim() || 'Desi Farm Grade',
      price_per_kg: Number(newPrice),
      stock_quantity_kg: Number(newStock),
      harvest_date: newHarvestDate,
      shelf_life_days: Number(newShelfLife),
      organic_certified: newOrganic,
      image_url: chosenImg,
      description: newDescription.trim() || 'Fresh chemical-free farm harvest with 100% grower provenance.',
      min_order_kg: Number(newMinOrder),
      status: 'available'
    });

    // Reset form
    setNewCropName('');
    setNewVariety('');
    setNewDescription('');
    setIsAddCropOpen(false);
    onRefreshData();
  };

  const handleUpdateCrop = (id: number) => {
    db.updateCrop(id, {
      price_per_kg: editPrice,
      stock_quantity_kg: editStock,
      status: editStock === 0 ? 'sold_out' : editStock < 50 ? 'low_stock' : 'available'
    });
    setEditingCropId(null);
    onRefreshData();
  };

  const handleDeleteCrop = (id: number) => {
    if (window.confirm('Delete this crop listing from the SQL database?')) {
      db.deleteCrop(id);
      onRefreshData();
    }
  };

  const handleAdvanceOrderStatus = (orderId: number, nextStatus: Order['status']) => {
    db.updateOrderStatus(orderId, nextStatus);
    onRefreshData();
  };

  const handleInquiryAction = (id: number, status: 'accepted' | 'declined') => {
    db.updateInquiryStatus(id, status);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Farmer Identity */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Producer Control Center</span>
            <span aria-hidden="true">·</span>
            <span>Verified Farm ID #{currentFarmerId}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {farmerProfile?.farm_name || 'GreenValley Organic Sanctuary'}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
            Managed by {currentUser?.full_name || 'Ramesh Patel'} · {farmerProfile?.farm_location || 'Karjat, Maharashtra'} ({farmerProfile?.total_acres || 14.5} Acres Regenerative Farmland)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddCropOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Harvest Crop</span>
          </button>
          <button
            onClick={onOpenSqlConsole}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Inspect Farm SQL Records</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Tabular figures, single level elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Zero commission deducted · 100% direct settlement
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider">
            <span>Escrow Vault (Held)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 tabular-nums">
            ₹{escrowPending.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Released to UPI when consumer receives batch
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider">
            <span>Produce Dispatched</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">
            {totalKgSold} kg
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Across {farmerOrders.length} verified direct consumer orders
          </div>
        </div>

        {/* Farmer Rating Metric Card */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider">
            <span>Farmer Reputation</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-stone-900 tabular-nums">
              {avgRating}
            </span>
            <span className="text-xs text-stone-500 font-semibold">/ 5.0</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Based on {farmerReviews.length} verified buyer reviews
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex items-center gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'text-emerald-700 border-b-2 border-emerald-700'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Produce Inventory ({farmerCrops.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-emerald-700 border-b-2 border-emerald-700'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Incoming Orders ({farmerOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'bids'
              ? 'text-emerald-700 border-b-2 border-emerald-700'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Wholesale Bids ({farmerInquiries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'text-emerald-700 border-b-2 border-emerald-700'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" />
          <span>Consumer Reviews ({farmerReviews.length})</span>
        </button>
      </div>

      {/* Tab Content: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Crop Produce</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Price / kg</th>
                    <th className="px-4 py-3 font-semibold">In Stock</th>
                    <th className="px-4 py-3 font-semibold">Harvest Date</th>
                    <th className="px-4 py-3 font-semibold">Organic</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {farmerCrops.map(crop => {
                    const isEditing = editingCropId === crop.id;
                    return (
                      <tr key={crop.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={crop.image_url}
                              alt={crop.crop_name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-stone-900">{crop.crop_name}</div>
                              <div className="text-[11px] text-stone-500">{crop.variety}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-600 font-medium">{crop.category}</td>
                        <td className="px-4 py-3 tabular-nums font-semibold text-stone-900">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={e => setEditPrice(Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-white border border-stone-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                            />
                          ) : (
                            `₹${crop.price_per_kg}`
                          )}
                        </td>
                        <td className="px-4 py-3 tabular-nums font-semibold">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={e => setEditStock(Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-white border border-stone-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                            />
                          ) : (
                            <span className={crop.stock_quantity_kg < 50 ? 'text-amber-600' : 'text-stone-900'}>
                              {crop.stock_quantity_kg} kg
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-stone-600 tabular-nums">{crop.harvest_date}</td>
                        <td className="px-4 py-3">
                          {crop.organic_certified ? (
                            <span className="text-emerald-700 font-medium">Certified</span>
                          ) : (
                            <span className="text-stone-500">Conventional</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <button
                                onClick={() => handleUpdateCrop(crop.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded text-[11px] hover:bg-emerald-500 cursor-pointer"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingCropId(crop.id);
                                  setEditPrice(crop.price_per_kg);
                                  setEditStock(crop.stock_quantity_kg);
                                }}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                                title="Edit Price / Stock"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCrop(crop.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Delete Crop"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: INCOMING ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {farmerOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
              No orders have been placed yet for this farm.
            </div>
          ) : (
            farmerOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {order.order_number}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-xs text-stone-600">Buyer: {order.consumer_name}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-xs text-stone-500 tabular-nums">{order.order_date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800 capitalize">
                      Status: {order.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      order.payment_status === 'released'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Escrow: {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="text-xs space-y-2">
                  <div className="font-semibold text-stone-700">Order Items:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items?.map(it => (
                      <div key={it.id} className="bg-stone-50 p-2.5 rounded-lg flex justify-between">
                        <span className="font-medium text-stone-800">{it.crop_name}</span>
                        <span className="text-stone-600 tabular-nums">
                          {it.quantity_kg} kg @ ₹{it.unit_price}/kg = <strong className="text-stone-900">₹{it.subtotal}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destination & Action flow */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-stone-100 gap-3 text-xs">
                  <div className="text-stone-500">
                    <strong>Shipping Address:</strong> {order.shipping_address}
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(order.id, 'harvested')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Mark as Harvested & Graded
                      </button>
                    )}
                    {order.status === 'harvested' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(order.id, 'in_transit')}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Handover to Logistics (Dispatch)
                      </button>
                    )}
                    {order.status === 'in_transit' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Delivered & Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: WHOLESALE INQUIRIES & BIDS */}
      {activeTab === 'bids' && (
        <div className="space-y-4">
          {farmerInquiries.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
              No direct wholesale negotiations or bids received yet.
            </div>
          ) : (
            farmerInquiries.map(inq => (
              <div
                key={inq.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                  <div className="font-semibold text-stone-900">
                    Crop: <span className="text-emerald-700">{inq.crop_name}</span>
                  </div>
                  <div className="text-stone-500 tabular-nums">{inq.created_at}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-lg">
                  <div>
                    <span className="text-stone-500">Buyer:</span>{' '}
                    <strong className="text-stone-800">{inq.consumer_name}</strong> ({inq.consumer_phone})
                  </div>
                  <div>
                    <span className="text-stone-500">Proposed Price:</span>{' '}
                    <strong className="text-emerald-700 tabular-nums">₹{inq.offered_price_per_kg} / kg</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Requested Volume:</span>{' '}
                    <strong className="text-stone-900 tabular-nums">{inq.quantity_kg} kg</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic">
                  "{inq.message}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div className="text-stone-500">
                    Estimated Deal Total:{' '}
                    <strong className="text-stone-900 tabular-nums">
                      ₹{(inq.offered_price_per_kg * inq.quantity_kg).toLocaleString()}
                    </strong>
                  </div>

                  {inq.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInquiryAction(inq.id, 'accepted')}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded font-semibold hover:bg-emerald-600 cursor-pointer"
                      >
                        Accept Wholesale Deal
                      </button>
                      <button
                        onClick={() => handleInquiryAction(inq.id, 'declined')}
                        className="px-3 py-1.5 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300 cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`font-semibold capitalize ${
                      inq.status === 'accepted' ? 'text-emerald-700' : 'text-stone-500'
                    }`}>
                      Status: {inq.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: CUSTOMER REVIEWS & REPUTATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Rating Summary Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Overall Score */}
              <div className="md:col-span-4 text-center md:text-left md:border-r border-stone-200 md:pr-6 space-y-2">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Verified Farm Rating
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-4xl font-extrabold text-stone-900 tabular-nums">
                    {avgRating}
                  </span>
                  <div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(Number(avgRating))
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5 tabular-nums">
                      {farmerReviews.length} total reviews
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Ratings reflect consumer satisfaction with produce freshness, truthful harvest grading, and packaging.
                </p>
              </div>

              {/* Star Distribution Bars */}
              <div className="md:col-span-8 space-y-1.5 text-xs">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = starCounts[stars] || 0;
                  const pct = farmerReviews.length > 0 ? (count / farmerReviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-12 text-stone-600 font-medium flex items-center gap-1 shrink-0">
                        <span>{stars}</span>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      </span>
                      <div className="flex-1 bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-stone-500 tabular-nums text-[11px]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Reviews List */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">
              All Consumer Reviews ({farmerReviews.length})
            </h3>

            {farmerReviews.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
                No consumer reviews submitted yet for this farm.
              </div>
            ) : (
              farmerReviews.map(rev => (
                <div
                  key={rev.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {rev.consumer_name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{rev.consumer_name}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Harvest Purchase</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-stone-400 tabular-nums mt-0.5">
                        {rev.created_at}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {isAddCropOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-display text-lg font-bold text-stone-900">
                List New Farm Produce
              </h3>
              <button
                onClick={() => setIsAddCropOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Heritage Carrots"
                  value={newCropName}
                  onChange={e => setNewCropName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Variety / Cultivar
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Desi Pusa Kesar"
                    value={newVariety}
                    onChange={e => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Direct Price (₹ / kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="2000"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Available Stock (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="50000"
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={e => setNewHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shelf Life (Days)
                  </label>
                  <input
                    type="number"
                    value={newShelfLife}
                    onChange={e => setNewShelfLife(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Produce Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Cultivation practices, soil conditions, and quality highlights..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organic_cert"
                  checked={newOrganic}
                  onChange={e => setNewOrganic(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <label htmlFor="organic_cert" className="text-xs text-stone-700 font-medium">
                  Cultivated using 100% Certified Organic / Regenerative Methods
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCropOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer shadow-sm"
                >
                  Save & Publish to SQL DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
