import React, { useState } from 'react';
import { Star, X, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';
import { Order, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/sqlDatabase';

interface ReviewModalProps {
  order: Order | null;
  farmerId?: number;
  farmerName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (review: Review) => void;
}

const RATING_LABELS = [
  'Select a rating',
  '1 Star - Unsatisfactory produce',
  '2 Stars - Fair quality, room for improvement',
  '3 Stars - Good farm harvest, as described',
  '4 Stars - Very good produce, fresh & crisp',
  '5 Stars - Outstanding! Fresh, authentic farm quality'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  farmerId,
  farmerName,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const targetFarmerId = order ? order.farmer_id : (farmerId || 1);
  const targetFarmerName = order ? order.farmer_name : (farmerName || 'Direct Farmer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || rating < 1) return;

    const newRev = db.addReview({
      farmer_id: targetFarmerId,
      farmer_name: targetFarmerName,
      consumer_id: currentUser.id,
      consumer_name: currentUser.full_name,
      order_id: order?.id,
      rating,
      comment: comment.trim() || 'High quality harvest, arrived fresh and well packed.'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSuccess(newRev);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-auto">
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
              Review & Rating Published!
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Logged into SQL database. Farmer {targetFarmerName}'s overall rating score has been updated in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Direct Harvest Review</span>
              </div>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Rate & Review {targetFarmerName}
              </h2>
              {order && (
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Order Reference: <strong className="font-mono text-stone-800">{order.order_number}</strong>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Interactive Selector */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-2">
                <label className="block font-semibold text-stone-700 text-xs">
                  Your Overall Harvest Rating (1-5 Stars) *
                </label>

                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map(star => {
                    const isActive = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-stone-300 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            isActive
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] font-medium text-emerald-800 min-h-[16px]">
                  {RATING_LABELS[hoverRating || rating]}
                </div>
              </div>

              {/* Written Comment Textarea */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Written Feedback & Harvest Quality *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share details on crop freshness, taste, packaging quality, and communication with the farmer..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit Farmer Review</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
