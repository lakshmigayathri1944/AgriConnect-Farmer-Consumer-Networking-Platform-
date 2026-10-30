import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalWeightKg,
    subtotalAmount,
    deliveryFee,
    grandTotal
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-base font-bold text-stone-900">
              Fresh Harvest Basket
            </h2>
            <span className="text-xs text-stone-500 font-medium tabular-nums">
              ({items.length} crops · {totalWeightKg} kg)
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Tracker */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
          {subtotalAmount >= 500 ? (
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Eligible for Free Direct-Farm Shipping!
            </span>
          ) : (
            <span>
              Add <strong className="text-emerald-950 tabular-nums">₹{500 - subtotalAmount}</strong> more for Free Shipping
            </span>
          )}
          <span className="text-[11px] text-emerald-700 font-medium tabular-nums">Threshold: ₹500</span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-bold text-stone-900 text-sm">Your basket is empty</p>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Explore our verified direct-from-farm crops and add harvest-fresh vegetables, grains, or fruits.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Start Browsing Produce
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.crop.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <img
                  src={item.crop.image_url}
                  alt={item.crop.crop_name}
                  className="w-16 h-16 rounded-lg object-cover bg-stone-200 border border-stone-200 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-semibold text-stone-900 text-xs truncate">
                      {item.crop.crop_name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.crop.id)}
                      className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-stone-500 truncate mt-0.5">
                    {item.crop.farm_name}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item.crop.id, item.quantity_kg - 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold tabular-nums text-stone-800">
                        {item.quantity_kg} kg
                      </span>
                      <button
                        onClick={() => updateQuantity(item.crop.id, item.quantity_kg + 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-stone-900 text-xs tabular-nums">
                        ₹{item.crop.price_per_kg * item.quantity_kg}
                      </div>
                      <div className="text-[10px] text-stone-500 tabular-nums">
                        @ ₹{item.crop.price_per_kg}/kg
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3 text-xs">
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Crop Produce Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">₹{subtotalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Freight Delivery</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>AgriConnect Escrow Fee</span>
                <span className="font-semibold text-stone-900 tabular-nums">₹5</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm text-stone-900">
                <span>Grand Total</span>
                <span className="text-emerald-800 tabular-nums">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onCheckout();
              }}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payments held in bank-backed escrow until delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
