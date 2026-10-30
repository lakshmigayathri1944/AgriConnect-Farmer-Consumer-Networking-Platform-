import React from 'react';
import { Search, ShieldCheck, Truck, Scale, ArrowRight } from 'lucide-react';
import { CropCategory } from '../types';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onExploreClick: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Crops', value: 'all' },
  { label: 'Fresh Vegetables', value: 'Vegetables' },
  { label: 'Grains & Rice', value: 'Grains' },
  { label: 'Organic Fruits', value: 'Fruits' },
  { label: 'Pulses & Dals', value: 'Pulses' }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreClick
}) => {
  return (
    <div className="relative bg-stone-900 text-white overflow-hidden border-b border-stone-800">
      {/* Background Hero Image with Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/agri_marketplace_hero_1793338567619.jpg"
          alt="Lush organic farmland harvest"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity filter contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 tracking-wide">
              <span>Direct Farm-to-Fork Platform</span>
              <span aria-hidden="true">·</span>
              <span>100% Middleman-Free</span>
              <span aria-hidden="true">·</span>
              <span>Verified APMC Benchmark</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              Connecting Certified Farmers Directly with Conscious Consumers.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Eliminate intermediaries, fair pricing directly to growers, and harvest-fresh produce delivered with complete transparency and escrow protection.
            </p>

            {/* Direct Search Bar & Filter Integration */}
            <div className="pt-2 max-w-2xl space-y-3">
              <div className="flex items-center bg-stone-900/90 border border-stone-700 rounded-xl p-1.5 shadow-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search fresh crops (e.g., Sharbati wheat, Alphonso mango, tomatoes)..."
                  className="w-full px-3 py-2 bg-transparent text-sm text-stone-100 placeholder-stone-400 focus:outline-none"
                />
                <button
                  onClick={onExploreClick}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                >
                  <span>Browse</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Segmented Category Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'bg-emerald-500 text-stone-950 font-semibold'
                        : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 border border-stone-700/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Value Props & Trust Verification Strip */}
          <div className="lg:col-span-4 bg-stone-900/80 backdrop-blur-sm border border-stone-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <h2 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Platform Guarantees
            </h2>

            <div className="space-y-4 text-sm text-stone-300">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-100">Escrow Security</div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    Buyer funds are held in escrow until harvest delivery is verified.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-100">Transparent APMC Pricing</div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    Real-time Mandi market rates eliminate non-transparent markups.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-100">Direct Cold Logistics</div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    Freshly picked from farm soil and delivered within 24–48 hours.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
