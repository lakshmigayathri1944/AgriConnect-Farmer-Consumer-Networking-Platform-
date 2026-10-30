import React, { useState } from 'react';
import { Crop, Review } from '../types';
import { useCart } from '../context/CartContext';
import { db } from '../db/sqlDatabase';
import {
  X,
  MapPin,
  Calendar,
  CheckCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Plus,
  Minus,
  MessageSquare,
  Star
} from 'lucide-react';

interface CropDetailModalProps {
  crop: Crop | null;
  onClose: () => void;
  onOpenNegotiate: (crop: Crop) => void;
  onOpenReview?: (farmerId: number, farmerName: string) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({
  crop,
  onClose,
  onOpenNegotiate,
  onOpenReview
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(crop?.min_order_kg || 1);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!crop) return null;

  const farmer = db.getFarmerById(crop.farmer_id);
  const reviews = db.getFarmerReviews(crop.farmer_id);
  const farmerRating = farmer?.rating?.toFixed(1) || '4.9';

  const handleAddToCart = () => {
    addToCart(crop, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200 max-w-3xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 p-2 rounded-full transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Image & Badges */}
            <div className="relative bg-stone-100 aspect-square md:aspect-auto">
              <img
                src={crop.image_url}
                alt={crop.crop_name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {crop.organic_certified && (
                <div className="absolute top-4 left-4 bg-emerald-900/90 text-emerald-200 text-xs font-semibold px-3 py-1 rounded shadow-xs">
                  Certified 100% Organic (NPOP)
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{crop.location}</span>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span>{crop.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Variety: {crop.variety}</span>
                </div>

                <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
                  {crop.crop_name}
                </h2>

                {/* Farmer Bio Strip with Star Rating */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-stone-900">{crop.farm_name}</div>
                    <div className="text-stone-500 text-[11px]">Cultivated by {crop.farmer_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end font-bold text-stone-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span className="tabular-nums">{farmerRating}</span>
                      <span className="text-[11px] text-stone-400 font-normal">({reviews.length})</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Verified Grower</div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {crop.description}
                </p>

                {/* Harvest details */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <span className="text-stone-500 block text-[11px]">Plucked / Harvested</span>
                    <span className="font-semibold text-stone-800 tabular-nums">{crop.harvest_date}</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <span className="text-stone-500 block text-[11px]">Available Harvest</span>
                    <span className="font-semibold text-stone-800 tabular-nums">{crop.stock_quantity_kg} kg</span>
                  </div>
                </div>
              </div>

              {/* Pricing and Purchase Action */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-stone-900 tabular-nums">
                      ₹{crop.price_per_kg}
                    </span>
                    <span className="text-xs text-stone-500 ml-1">/ kg</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">Total for {quantity} kg</span>
                    <span className="text-lg font-bold text-emerald-800 tabular-nums">
                      ₹{crop.price_per_kg * quantity}
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl border border-stone-200 text-xs">
                  <span className="font-medium text-stone-700 pl-2">
                    Select Weight (min {crop.min_order_kg} kg):
                  </span>
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(crop.min_order_kg, q - 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-stone-900 tabular-nums">
                      {quantity} kg
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(crop.stock_quantity_kg, q + 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNegotiate(crop);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-stone-500" />
                    <span>Wholesale Inquiry</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} kg</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section for this Farmer */}
          <div className="p-6 sm:p-8 bg-stone-50 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>Customer Reviews for {crop.farmer_name}</span>
                  <span className="text-xs text-stone-500 font-sans font-normal">
                    ({reviews.length} reviews · {farmerRating} ★)
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Verified feedback from consumers who ordered directly from this farm.
                </p>
              </div>

              {onOpenReview && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenReview(crop.farmer_id, crop.farmer_name);
                  }}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Write a Review</span>
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No reviews yet for this farm. Be the first to order and review!</p>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, showAllReviews ? undefined : 2).map(r => (
                  <div key={r.id} className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{r.consumer_name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-normal">
                          Verified Buyer
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      "{r.comment}"
                    </p>
                    <div className="text-[10px] text-stone-400 tabular-nums">
                      {r.created_at}
                    </div>
                  </div>
                ))}

                {reviews.length > 2 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {showAllReviews ? 'Show fewer reviews' : `View all ${reviews.length} reviews`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
