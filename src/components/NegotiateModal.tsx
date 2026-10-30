import React, { useState } from 'react';
import { Crop } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/sqlDatabase';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface NegotiateModalProps {
  crop: Crop | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NegotiateModal: React.FC<NegotiateModalProps> = ({
  crop,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [offeredPrice, setOfferedPrice] = useState<number>(crop ? Math.max(1, crop.price_per_kg - 5) : 35);
  const [quantity, setQuantity] = useState<number>(50);
  const [message, setMessage] = useState('We are a local community cooperative ordering weekly bulk crates. Looking forward to establishing a direct recurring harvest contract.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !crop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    db.submitInquiry({
      crop_id: crop.id,
      crop_name: crop.crop_name,
      farmer_id: crop.farmer_id,
      consumer_id: currentUser.id,
      consumer_name: currentUser.full_name,
      consumer_phone: currentUser.phone,
      offered_price_per_kg: Number(offeredPrice),
      quantity_kg: Number(quantity),
      message: message.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSuccess();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Wholesale Bid Transmitted!
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Logged into SQL <code className="font-mono text-emerald-800">crop_inquiries</code> table. Farmer {crop.farmer_name} will review your offer in their dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Farmer Wholesale Negotiation</span>
              </div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Bid on {crop.crop_name}
              </h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Current listing price: <strong className="text-stone-800 tabular-nums">₹{crop.price_per_kg}/kg</strong> · Available stock: <strong className="text-stone-800 tabular-nums">{crop.stock_quantity_kg} kg</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Your Proposed Price (₹/kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    max={crop.price_per_kg * 2}
                    value={offeredPrice}
                    onChange={e => setOfferedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Requested Volume (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min={crop.min_order_kg}
                    max={crop.stock_quantity_kg}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
                <span className="text-stone-600 font-medium">Estimated Deal Volume Total:</span>
                <span className="font-bold text-stone-900 text-sm tabular-nums">
                  ₹{(offeredPrice * quantity).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Message / Dispatch Schedule Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Wholesale Proposal</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
